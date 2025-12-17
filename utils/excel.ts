import { Buffer } from "buffer"
import * as XLSX from "xlsx"
import { EXCEL_VALIDATION_ERROR, EXCEL_DATE_FORMAT_ERROR } from "./error"

/**
 * Represents a row from eLSA Excel file
 * @interface ElsaxcelRow
 */
interface ElsaxcelRow {
  Pvm: string | number
  Klo: string
  Kenttä: string
  Koti: string
  Vieras: string
  Sarja: string
  Tulos: string
}

/**
 * Represents a processed row in MyClub format
 * @interface MyClubExcelRow
 */
export interface MyClubExcelRow {
  Nimi: string
  Ryhmä: string
  Tapahtumatyyppi: string
  Tapahtumapaikka: string
  Alkaa: string
  Päättyy: string
  Ilmoittautuminen: string
  Näkyvyys: string
  Kuvaus: string
}

export const excelUtils = {
  parseExcelBuffer(buffer: Buffer, fields: Record<string, string>): MyClubExcelRow[] {
    const workbook = XLSX.read(buffer)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<ElsaxcelRow>(firstSheet)

    const year = String(fields.year || new Date().getFullYear())
    const duration = parseInt(String(fields.duration || "75"), 10)
    const meetingTime = parseInt(String(fields.meetingTime || "0"), 10)

    const processedData: MyClubExcelRow[] = jsonData
      .map((row: ElsaxcelRow): MyClubExcelRow | null => {
        // If game has results it's probably in the past so no need to add to MyClub calendar
        if (row.Tulos && /^\d+.+\d+$/.test(row.Tulos.trim())) {
          return null
        }

        // If we don't have a time or date, skip the row
        if (!row.Klo || !row.Pvm) {
          return null
        }

        try {
          const normalizedDate = this.normalizeDate(row.Pvm)
          const { startTime, endTime } = this.calculateEventTimes(row.Klo, meetingTime, duration)
          const startDateTime = this.formatDateTime(normalizedDate, startTime, year)
          const endDateTime = this.formatDateTime(normalizedDate, endTime, year)

          return {
            Nimi: this.formatEventName(row.Sarja, row.Koti, row.Vieras),
            Alkaa: startDateTime,
            Päättyy: endDateTime,
            Ryhmä: fields.group || "",
            Kuvaus: this.createDescription(row.Klo, meetingTime),
            Tapahtumatyyppi: fields.eventType || "Ottelu",
            Tapahtumapaikka: row.Kenttä || "",
            Ilmoittautuminen: fields.registration || "Valituille henkilöille",
            Näkyvyys: "Ryhmälle",
          }
        } catch (err) {
          console.warn(
            "Warning: Error processing row:",
            err instanceof Error ? err.message : String(err)
          )
          return null
        }
      })
      .filter((row): row is MyClubExcelRow => row !== null)

    if (processedData.length === 0) {
      throw new Error(EXCEL_VALIDATION_ERROR)
    }

    return processedData
  },

  normalizeDate(date: string | number): string {
    const dateStr = typeof date === "number" ? date.toFixed(2) : String(date)
    const cleanDate = dateStr.replace(",", ".")
    const parts = cleanDate.split(".")

    if (parts.length !== 2) {
      throw new Error(EXCEL_DATE_FORMAT_ERROR(date))
    }

    const day = parts[0].padStart(2, "0")
    const month = parts[1].padStart(2, "0")

    return `${day}.${month}.`
  },

  formatDateTime(date: string, time: string, year: string | number): string {
    return `${date}${year} ${time}:00`
  },

  calculateEventTimes(
    gameTime: string,
    meetingMinutes: number,
    durationMinutes: number
  ): { startTime: string; endTime: string } {
    const [hours, minutes] = gameTime.replace(" ", "").split(":").map(Number)
    const gameDate = new Date(2000, 0, 1, hours, minutes)

    const startDate = new Date(gameDate.getTime() - meetingMinutes * 60000)
    const startTime = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`

    const endDate = new Date(gameDate.getTime() + durationMinutes * 60000)
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

    return { startTime, endTime }
  },

  formatSeriesName(fullSeries: string): string {
    const divMatch = fullSeries.match(/(I+)\s*divisioona/i)
    return divMatch ? `${divMatch[1]} div.` : ""
  },

  formatEventName(series: string, homeTeam: string, awayTeam: string): string {
    const formattedSeries = this.formatSeriesName(series)
    return formattedSeries
      ? `${formattedSeries} ${homeTeam} - ${awayTeam}`
      : `${homeTeam} - ${awayTeam}`
  },

  createDescription(originalTime: string, meetingTime: number): string {
    const gameStart = `Peli alkaa: ${originalTime}`

    if (meetingTime === 0) {
      return gameStart
    }

    const [hours, minutes] = originalTime.replace(" ", "").split(":").map(Number)
    const date = new Date(2000, 0, 1, hours, minutes)
    date.setMinutes(date.getMinutes() - meetingTime)
    const warmupTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`

    return `Lämppä: ${warmupTime}, ${gameStart}`
  },
}
