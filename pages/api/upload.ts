import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, Fields, Files } from 'formidable'
import * as XLSX from 'xlsx'
import { promises as fs } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface ProcessedRow {
  Nimi: string
  Ryhmä: string
  Tapahtumatyyppi: string
  Tapahtumapaikka: string
  Alkaa: string
  Päättyy: string
  Ilmoittautuminen: string
  Näkyvyys: string
}

interface ExcelRow {
  Pvm: string | number
  Klo: string
  Kenttä: string
  Koti: string
  Vieras: string
  Sarja: string
}

/**
 * Normalizes date string from ELSA format to Finnish format
 * @param date - Date in ELSA format (currently very inconveniently formatted as e.g. "14,12" or 14.12 or "14.12")
 * @returns Normalized date string (e.g. "14.12.")
 * @throws {Error} If date format is not what we expect
 */
export function normalizeDate(date: string | number): string {
  const dateStr = typeof date === 'number'
    ? date.toFixed(2)
    : String(date)

  const cleanDate = dateStr.replace(',', '.')
  const parts = cleanDate.split('.')

  if (parts.length !== 2) {
    throw new Error(`Odottamaton päivämäärämuoto: ${date}`)
  }

  const day = parts[0].padStart(2, '0')
  const month = parts[1].padStart(2, '0')

  return `${day}.${month}.`
}

/**
 * Formats date and time into MyClub datetime format
 * @param date - Normalized date string (e.g. "14.12.")
 * @param time - Time string (e.g. "12:30")
 * @param year - Year as string or number
 * @returns Formatted datetime (e.g. "14.12.2025 12:30:00")
 */
export function formatDateTime(date: string, time: string, year: string | number): string {
  return `${date}${year} ${time}:00`
}

/**
 * Calculates end time based on start time and duration
 * @param startTime - Start time (e.g. "12:30")
 * @param durationMinutes - Duration in minutes
 * @returns End time (e.g. "14:30")
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date(2000, 0, 1, hours, minutes)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
}

/**
 * Adjusts start time by adding minutes (for warm-up time)
 * @param time - Original time (e.g. "12:30" or "12: 30")
 * @param adjustment - Minutes to add (can be 0)
 * @returns Adjusted time (e.g. "12:45")
 */
export function adjustStartTime(time: string, adjustment: number): string {
  if (adjustment === 0) return time.replace(' ', '')

  const [hours, minutes] = time.replace(' ', '').split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  date.setMinutes(date.getMinutes() + adjustment)

  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

/**
 * Extracts and formats division name from full series name
 * @param fullSeries - Full series name from ELSA (e.g. "11-vuotiaat tytöt I divisioona")
 * @returns Formatted division (e.g. "I div.") or empty string if no match
 */
export function formatSeriesName(fullSeries: string): string {
  const divMatch = fullSeries.match(/(I+)\s*divisioona/i)
  return divMatch ? `${divMatch[1]} div.` : ''
}

/**
 * Formats event name for MyClub from series and team names
 * @param series - Full series name from ELSA
 * @param homeTeam - Home team name
 * @param awayTeam - Away team name
 * @returns Formatted event name (e.g. "I div. Team A - Team B")
 */
export function formatEventName(series: string, homeTeam: string, awayTeam: string): string {
  const formattedSeries = formatSeriesName(series)
  return formattedSeries
    ? `${formattedSeries} ${homeTeam} - ${awayTeam}`
    : `${homeTeam} - ${awayTeam}`
}

function getMyclubGroupValue(fields: Fields): string {
  return String(fields.group?.[0] || 'Edustus') // Default to "Edustus" if not specified
}

function getMyclubEventType(fields: Fields): string {
  const eventType = fields.eventType?.[0]
  return eventType === 'Muu' ? 'Muu' : 'Ottelu' // Default to "Ottelu"
}

function getMyclubRegistration(fields: Fields): string {
  const registration = fields.registration?.[0]
  const validOptions = ['Ryhmän jäsenille', 'Seuralle', 'Valituille henkilöille']
  return validOptions.includes(String(registration))
    ? String(registration)
    : 'Valituille henkilöille'
}

function createDescription(originalTime: string, startAdjustment: number): string {
  const gameStart = `<p><strong>Game start</strong>: ${originalTime}</p>`

  // We don't need warm-up if startAdjustment is 0
  if (startAdjustment === 0) {
    return gameStart
  }

  return `<p>Warm-up: ${adjustStartTime(originalTime, startAdjustment)}</p>
${gameStart}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = new IncomingForm()
    const [fields, files]: [Fields, Files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file
    if (!uploadedFile) {
      return res.status(400).json({ message: 'Ei lisättyä tiedostoa' })
    }

    const fileData = await fs.readFile(uploadedFile.filepath)
    const workbook = XLSX.read(fileData)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(firstSheet)

    const year = String(fields.year?.[0] || new Date().getFullYear())
    const duration = parseInt(fields.duration?.[0] || '75', 10)
    const startAdjustment = parseInt(fields.startAdjustment?.[0] || '0', 10)

    const processedData: ProcessedRow[] = jsonData
      .map((row: ExcelRow): ProcessedRow | null => {
        if (!row.Klo || !row.Pvm) {
          return null
        }

        try {
          const normalizedDate = normalizeDate(row.Pvm)
          const adjustedStartTime = adjustStartTime(row.Klo, startAdjustment)
          const startDateTime = formatDateTime(normalizedDate, adjustedStartTime, year)
          const endTime = calculateEndTime(row.Klo, duration)
          const endDateTime = formatDateTime(normalizedDate, endTime, year)

          return {
            'Nimi': formatEventName(row.Sarja, row.Koti, row.Vieras),
            'Kuvaus': createDescription(row.Klo, startAdjustment),
            'Ryhmä': getMyclubGroupValue(fields),
            'Tapahtumatyyppi': getMyclubEventType(fields),
            'Tapahtumapaikka': row.Kenttä,
            'Alkaa': startDateTime,
            'Päättyy': endDateTime,
            'Ilmoittautuminen': getMyclubRegistration(fields),
            'Näkyvyys': 'Näkyy ryhmälle',
          } as ProcessedRow
        } catch (err) {
          console.warn(`Warning: Error processing row:`, err instanceof Error ? err.message : String(err))
          return null
        }
      })
      .filter((row): row is ProcessedRow => row !== null)

    if (processedData.length === 0) {
      return res.status(400).json({
        message: 'Excel-tiedoston prosessointi epäonnistui. Tarkistathan että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras).'
      })
    }

    const newWorkbook = XLSX.utils.book_new()
    const newSheet = XLSX.utils.json_to_sheet(processedData)
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'MyClub Import')

    const buffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="myclub_import.xlsx"'
    )
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

    res.send(buffer)

  } catch (error) {
    console.error('Detailed error:', error)
    res.status(500).json({
      message: `Virhe tiedoston prosessoinnissa: ${error instanceof Error ? error.message : String(error)}`
    })
  }
}
