import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, Fields, Files } from 'formidable'
import xlsx from 'xlsx'
import { promises as fs } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

function normalizeDate(date: any): string {
  // If it's a number, convert to string with fixed decimal places
  // This handles Excel's number format (e.g., 22.09 as number)
  const dateStr = typeof date === 'number'
    ? date.toFixed(2)  // Ensures we get "22.09" instead of "22.9"
    : String(date)

  // Replace any commas with periods
  const cleanDate = dateStr.replace(',', '.')

  // Split by period and handle cases like "27.1"
  const parts = cleanDate.split('.')

  if (parts.length !== 2) {
    throw new Error(`Invalid date format: ${date}`)
  }

  // Pad both day and month with leading zeros
  const day = parts[0].padStart(2, '0')
  const month = parts[1].padStart(2, '0')

  return `${day}.${month}.`
}

function formatDateTime(date: string, time: string, year: string | number): string {
  return `${date}${year} ${time}:00`
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date(2000, 0, 1, hours, minutes)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
}

function formatSeriesName(fullSeries: string): string {
  // Extract division from the full series name
  const divMatch = fullSeries.match(/(I+)\s*divisioona/i)
  if (divMatch) {
    return `${divMatch[1]} div.`
  }
  return '' // Return empty string if no division found
}

function formatEventName(series: string, homeTeam: string, awayTeam: string): string {
  const formattedSeries = formatSeriesName(series)
  return formattedSeries
    ? `${formattedSeries} ${homeTeam} - ${awayTeam}`
    : `${homeTeam} - ${awayTeam}`
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

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileData = await fs.readFile(file.filepath)
    const workbook = xlsx.read(fileData)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = xlsx.utils.sheet_to_json(firstSheet)

    const year = String(fields.year?.[0] || new Date().getFullYear())
    const duration = parseInt(fields.duration?.[0] || '75', 10)

    const processedData = jsonData.map((row: any, index: number) => {
      const rawDate = row['Pvm']
      console.log(`Row ${index} date:`, rawDate, 'type:', typeof rawDate) // Debug log
      const time = row['Klo']
      const location = row['Kenttä']
      const homeTeam = row['Koti']
      const awayTeam = row['Vieras']
      const series = row['Sarja']

      if (!time || !rawDate) {
        console.warn(`Warning: Missing data in row ${index}`, row)
        return null
      }

      try {
        const normalizedDate = normalizeDate(rawDate)
        const startDateTime = formatDateTime(normalizedDate, time, year)
        const endTime = calculateEndTime(time, duration)
        const endDateTime = formatDateTime(normalizedDate, endTime, year)

        return {
          'Tapahtuma': formatEventName(series, homeTeam, awayTeam),
          'Alkaa': startDateTime,
          'Päättyy': endDateTime,
          'Paikka': location,
        }
      } catch (err) {
        console.warn(`Warning: Error processing row ${index}:`, err.message)
        return null
      }
    }).filter(row => row !== null)

    if (processedData.length === 0) {
      return res.status(400).json({
        message: 'Could not process any rows from the Excel file. Please check the column names match the expected format (Pvm, Klo, Kenttä, etc.)'
      })
    }

    const newWorkbook = xlsx.utils.book_new()
    const newSheet = xlsx.utils.json_to_sheet(processedData)
    xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'MyClub Import')

    const buffer = xlsx.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' })

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
    res.status(500).json({ message: `Error processing file: ${error.message}` })
  }
}
