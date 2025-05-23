import { Fields, Files } from "formidable"
import * as XLSX from "xlsx"
import { promises as fs } from "fs"

/**
 * Represents a row from ELSA Excel file
 * @interface ElsaxcelRow
 */
export interface ElsaxcelRow {
  Pvm: string | number
  Klo: string
  Kenttä: string
  Koti: string
  Vieras: string
  Sarja: string
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
  normalizeDate(date: string | number): string {
    const dateStr = typeof date === "number" ? date.toFixed(2) : String(date)
    const cleanDate = dateStr.replace(",", ".")
    const parts = cleanDate.split(".")

    if (parts.length !== 2) {
      throw new Error(`Odottamaton päivämäärämuoto: ${date}`)
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

  adjustStartTime(time: string, adjustment: number): string {
    if (adjustment === 0) {
      return time.replace(" ", "")
    }

    const [hours, minutes] = time.replace(" ", "").split(":").map(Number)
    const date = new Date(2000, 0, 1, hours, minutes)
    date.setMinutes(date.getMinutes() - adjustment)

    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
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

    return `Lämppä: ${this.adjustStartTime(originalTime, meetingTime)}, ${gameStart}`
  },

  /**
   * Parses uploaded Excel file and form data into processed MyClub format
   * @param fields - Form fields from the request
   * @param files - Uploaded files from the request
   * @returns Processed data in MyClub format
   */
  async parseExcelFile(fields: Fields, files: Files): Promise<MyClubExcelRow[]> {
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file
    if (!uploadedFile) {
      throw new Error("Ei lisättyä tiedostoa")
    }

    const fileData = await fs.readFile(uploadedFile.filepath)
    const workbook = XLSX.read(fileData)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<ElsaxcelRow>(firstSheet)

    const year = String(fields.year?.[0] || new Date().getFullYear())
    const duration = parseInt(fields.duration?.[0] || "75", 10)
    const meetingTime = parseInt(fields.meetingTime?.[0] || "0", 10)

    const processedData: MyClubExcelRow[] = jsonData
      .map((row: ElsaxcelRow): MyClubExcelRow | null => {
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
            Ryhmä: String(fields.group?.[0]),
            Kuvaus: this.createDescription(row.Klo, meetingTime),
            Tapahtumatyyppi: String(fields.eventType?.[0]),
            Tapahtumapaikka: row.Kenttä,
            Ilmoittautuminen: String(fields.registration?.[0]),
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
      .filter((row): row is MyClubExcelRow => row !== null)

    if (processedData.length === 0) {
      throw new Error(
        "Tarkista että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja että tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras)."
      )
    }

    return processedData
  },
}
