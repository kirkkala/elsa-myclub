import { IncomingForm, Fields, Files } from "formidable"
import * as XLSX from "xlsx"
import { promises as fs } from "fs"
import type { NextApiHandler } from "next"
import {
  normalizeDate,
  formatDateTime,
  calculateEventTimes,
  formatEventName,
  getMyclubGroupValue,
  getMyclubEventType,
  getMyclubRegistration,
  createDescription,
  type ExcelRow,
  type ProcessedRow,
} from "./upload"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const form = new IncomingForm()
    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, formFields: Fields, formFiles: Files) => {
        if (err) {
          reject(new Error(String(err)))
        }
        resolve([formFields, formFiles])
      })
    })

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
            Ryhmä: getMyclubGroupValue(fields),
            Kuvaus: createDescription(row.Klo, startAdjustment),
            Tapahtumatyyppi: getMyclubEventType(fields),
            Tapahtumapaikka: row.Kenttä,
            Alkaa: startDateTime,
            Päättyy: endDateTime,
            Ilmoittautuminen: getMyclubRegistration(fields),
            Näkyvyys: "Näkyy ryhmälle",
          }
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
          "Excel-tiedoston prosessointi epäonnistui. Tarkistathan että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu.",
      })
    }

    // Set proper headers for JSON response
    res.setHeader("Content-Type", "application/json")
    return res.status(200).json({ data: processedData })
  } catch (error) {
    console.error("Detailed error:", error)
    return res.status(500).json({
      message: `Virhe tiedoston prosessoinnissa: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
}

export default handler
