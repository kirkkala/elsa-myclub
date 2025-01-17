import { IncomingForm, Fields, Files } from "formidable"
import * as XLSX from "xlsx"
import { promises as fs } from "fs"
import type { NextApiHandler } from "next"

export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Represents a row from ELSA Excel file
 * @interface ExcelRow
 * @property {string | number} Pvm - Date in ELSA format (e.g. "14,12" or 14.12)
 * @property {string} Klo - Time in 24h format (e.g. "12:30")
 * @property {string} Kenttä - Venue name
 * @property {string} Koti - Home team name
 * @property {string} Vieras - Away team name
 * @property {string} Sarja - Full series name (e.g. "11-vuotiaat tytöt I divisioona")
 */
interface ExcelRow {
  Pvm: string | number
  Klo: string
  Kenttä: string
  Koti: string
  Vieras: string
  Sarja: string
}

/**
 * Represents a processed row in MyClub format
 * @interface ProcessedRow
 * @property {string} Nimi - Event name (e.g. "I div. Team A - Team B")
 * @property {string} Ryhmä - Team/group name in MyClub
 * @property {string} Tapahtumatyyppi - Event type ("Ottelu" or "Muu")
 * @property {string} Tapahtumapaikka - Venue name
 * @property {string} Alkaa - Start time (e.g. "14.12.2025 12:30:00")
 * @property {string} Päättyy - End time (e.g. "14.12.2025 14:30:00")
 * @property {string} Ilmoittautuminen - Registration type
 * @property {string} Näkyvyys - Visibility setting (always "Näkyy ryhmälle")
 */
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

/**
 * Normalizes date string from ELSA format to Finnish format accepted by MyClub
 * @param date - Date in ELSA format (currently very inconveniently formatted as e.g. "14,12" or 14.12 or "14.12")
 * @returns Normalized date string (e.g. "14.12.")
 * @throws {Error} If date format is not what we expect
 */
export function normalizeDate(date: string | number): string {
  const dateStr = typeof date === "number" ? date.toFixed(2) : String(date)

  const cleanDate = dateStr.replace(",", ".")
  const parts = cleanDate.split(".")

  if (parts.length !== 2) {
    throw new Error(`Odottamaton päivämäärämuoto: ${date}`)
  }

  const day = parts[0].padStart(2, "0")
  const month = parts[1].padStart(2, "0")

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
 * Adjusts event times based on meeting time, warm-up time, and game duration
 * @param gameTime - Original game time (e.g. "12:30")
 * @param meetingMinutes - Meeting time in minutes (subtracted from start)
 * @param warmupMinutes - Warm-up time in minutes (added to start)
 * @param durationMinutes - Game duration in minutes
 * @returns Object with start and end times
 */
export function calculateEventTimes(
  gameTime: string,
  meetingMinutes: number,
  warmupMinutes: number,
  durationMinutes: number
): { startTime: string; endTime: string } {
  // First subtract meeting time from the game time to get event start
  const [hours, minutes] = gameTime.replace(" ", "").split(":").map(Number)
  const gameDate = new Date(2000, 0, 1, hours, minutes)

  // Calculate start time by subtracting meeting time and adding warm-up time
  const startDate = new Date(gameDate.getTime() - meetingMinutes * 60000 + warmupMinutes * 60000)
  const startTime = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`

  // Calculate end time from game time plus duration
  const endDate = new Date(gameDate.getTime() + durationMinutes * 60000)
  const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

  return { startTime, endTime }
}

/**
 * Adjusts start time by adding minutes (for warm-up time)
 * @param time - Original time (e.g. "12:30" or "12: 30")
 * @param adjustment - Minutes to add (can be 0)
 * @returns Adjusted time (e.g. "12:45")
 */
export function adjustStartTime(time: string, adjustment: number): string {
  if (adjustment === 0) {
    return time.replace(" ", "")
  }

  const [hours, minutes] = time.replace(" ", "").split(":").map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  date.setMinutes(date.getMinutes() + adjustment)

  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

/**
 * Extracts and formats division name from full series name
 * @param fullSeries - Full series name from ELSA (e.g. "11-vuotiaat tytöt I divisioona")
 * @returns Formatted division (e.g. "I div.") or empty string if no match
 */
export function formatSeriesName(fullSeries: string): string {
  const divMatch = fullSeries.match(/(I+)\s*divisioona/i)
  return divMatch ? `${divMatch[1]} div.` : ""
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

/**
 * Gets the MyClub group value from form fields
 * @param fields - Form fields from the upload request
 * @returns Group name, defaults to a name that hint user to set it if not specified
 */
function getMyclubGroupValue(fields: Fields): string {
  return String(fields.group?.[0] || "MyClub ryhmän nimi")
}

/**
 * Gets the MyClub event type from form fields
 * @param fields - Form fields from the upload request
 * @returns Event type, either "Ottelu" or "Muu" (defaults to "Ottelu")
 */
function getMyclubEventType(fields: Fields): string {
  const eventType = fields.eventType?.[0]
  return eventType === "Muu" ? "Muu" : "Ottelu"
}

/**
 * Gets the MyClub registration type from form fields
 * @param fields - Form fields from the upload request
 * @returns Registration type, one of: "Ryhmän jäsenille", "Seuralle", "Valituille henkilöille"
 * Defaults to "Valituille henkilöille" if invalid value provided
 */
function getMyclubRegistration(fields: Fields): string {
  const registration = fields.registration?.[0]
  const validOptions = ["Ryhmän jäsenille", "Seuralle", "Valituille henkilöille"]
  return validOptions.includes(String(registration))
    ? String(registration)
    : "Valituille henkilöille"
}

/**
 * Creates HTML description for MyClub event
 * @param originalTime - Original game start time (e.g. "12:30")
 * @param startAdjustment - Minutes to adjust for warm-up (0 for no warm-up)
 * @returns HTML formatted description with game start and optional warm-up time
 * @see adjustStartTime - Used to calculate warm-up time
 */
function createDescription(originalTime: string, startAdjustment: number): string {
  const gameStart = `<p><strong>Game start</strong>: ${originalTime}</p>`

  if (startAdjustment === 0) {
    return gameStart
  }

  return `<p>Warm-up: ${adjustStartTime(originalTime, startAdjustment)}</p>
${gameStart}`
}

/**
 * API endpoint handler for converting ELSA Excel files to MyClub format
 * @async
 * @param req - Next.js API request
 * @param res - Next.js API response
 *
 * @description
 * Handles file upload and conversion process:
 * 1. Parses multipart form data (Excel file + settings)
 * 2. Reads Excel file content
 * 3. Converts ELSA format to MyClub format
 * 4. Returns converted Excel file
 *
 * @example
 * Required form fields:
 * - file: Excel file from ELSA, uploaded by the user
 * - year: Target year for events
 * - duration: Game duration in minutes
 * - startAdjustment: Warm-up time in minutes
 * - group: MyClub group name
 *
 * Optional form fields:
 * - eventType: "Ottelu" or "Muu" (default: "Ottelu")
 * - registration: Registration type (default: "Valituille henkilöille")
 *
 * @throws {Error} If file upload fails or Excel processing fails
 * @returns Excel file in MyClub format or error response
 */
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const form = new IncomingForm()
    const formData = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, formFields: Fields, formFiles: Files) => {
        if (err) {
          reject(new Error(String(err)))
        }
        resolve([formFields, formFiles])
      })
    })
    const [fields, files] = formData

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file
    if (!uploadedFile) {
      return res.status(400).json({ message: "Ei lisättyä tiedostoa" })
    }

    const fileData = await fs.readFile(uploadedFile.filepath)
    const workbook = XLSX.read(fileData)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(firstSheet)

    const year = String(fields.year?.[0] || new Date().getFullYear())
    const duration = parseInt(fields.duration?.[0] || "75", 10)
    const startAdjustment = parseInt(fields.startAdjustment?.[0] || "0", 10)
    const meetingTime = parseInt(fields.meetingTime?.[0] || "0", 10)

    const processedData: ProcessedRow[] = jsonData
      .map((row: ExcelRow): ProcessedRow | null => {
        if (!row.Klo || !row.Pvm) {
          return null
        }

        try {
          const normalizedDate = normalizeDate(row.Pvm)
          const { startTime, endTime } = calculateEventTimes(
            row.Klo,
            meetingTime,
            startAdjustment,
            duration
          )
          const startDateTime = formatDateTime(normalizedDate, startTime, year)
          const endDateTime = formatDateTime(normalizedDate, endTime, year)

          return {
            Nimi: formatEventName(row.Sarja, row.Koti, row.Vieras),
            Kuvaus: createDescription(row.Klo, startAdjustment),
            Ryhmä: getMyclubGroupValue(fields),
            Tapahtumatyyppi: getMyclubEventType(fields),
            Tapahtumapaikka: row.Kenttä,
            Alkaa: startDateTime,
            Päättyy: endDateTime,
            Ilmoittautuminen: getMyclubRegistration(fields),
            Näkyvyys: "Näkyy ryhmälle",
          } as ProcessedRow
        } catch (err) {
          console.warn(
            "Warning: Error processing row:",
            err instanceof Error ? err.message : String(err)
          )
          return null
        }
      })
      .filter((row): row is ProcessedRow => row !== null)

    if (processedData.length === 0) {
      return res.status(400).json({
        message:
          "Excel-tiedoston prosessointi epäonnistui. Tarkistathan että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras).",
      })
    }

    const newWorkbook = XLSX.utils.book_new()
    const newSheet = XLSX.utils.json_to_sheet(processedData)
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "MyClub Import")

    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" }) as Buffer

    // @todo: use the original filename with myclub prefix
    const filename = "elsa-myclub-import.xlsx"
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.send(buffer)
  } catch (error) {
    console.error("Detailed error:", error)
    res.status(500).json({
      message: `Virhe tiedoston prosessoinnissa: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
}

export default handler
