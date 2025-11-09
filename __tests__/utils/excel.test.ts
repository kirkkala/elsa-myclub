import { excelUtils } from "@/utils/excel"
import * as XLSX from "xlsx"
import { EXCEL_VALIDATION_ERROR } from "@/utils/error"

// Mock XLSX
jest.mock("xlsx", () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}))

const mockXLSX = XLSX as jest.Mocked<typeof XLSX>

describe("Excel utilities", () => {
  test.each([
    // [series, home, away, expected]
    ["I divisioona", "Team A", "Team B", "I div. Team A - Team B"],
    ["III divisioona", "Team C", "Team D", "III div. Team C - Team D"],
    ["harrastesarja", "Team E", "Team F", "Team E - Team F"],
  ])("formatEventName: %s → %s", (series, home, away, expected) => {
    expect(excelUtils.formatEventName(series, home, away)).toBe(expected)
  })

  test.each([
    // [input, expected]
    ["I divisioona", "I div."],
    ["III divisioona", "III div."],
    ["harrastesarja", ""],
  ])("formatSeriesName: %s → %s", (input, expected) => {
    expect(excelUtils.formatSeriesName(input)).toBe(expected)
  })

  test.each([
    // [input, expected]
    ["14,12", "14.12."],
    ["14.12", "14.12."],
    [14.12, "14.12."],
    ["4,3", "04.03."],
    [4.03, "04.03."],
  ])("normalizeDate: %s → %s", (input, expected) => {
    expect(excelUtils.normalizeDate(input)).toBe(expected)
  })

  it("normalizeDate throws on invalid format", () => {
    expect(() => excelUtils.normalizeDate("invalid")).toThrow("Odottamaton päivämäärämuoto")
  })

  test.each([
    // [date, time, year, expected]
    ["14.12.", "12:30", "2025", "14.12.2025 12:30:00"],
    ["14.12.", "12:30", 2025, "14.12.2025 12:30:00"],
  ])("formatDateTime: %s %s %s → %s", (date, time, year, expected) => {
    expect(excelUtils.formatDateTime(date, time, year)).toBe(expected)
  })

  test.each([
    // [gameTime, meetingMinutes, durationMinutes, expectedStart, expectedEnd]
    ["12:30", 0, 120, "12:30", "14:30"],
    ["12:30", 30, 120, "12:00", "14:30"],
    ["23:30", 0, 60, "23:30", "00:30"],
    ["00:30", 30, 60, "00:00", "01:30"],
  ])(
    "calculateEventTimes: %s meeting=%d duration=%d → start=%s end=%s",
    (gameTime, meeting, duration, start, end) => {
      expect(excelUtils.calculateEventTimes(gameTime, meeting, duration)).toEqual({
        startTime: start,
        endTime: end,
      })
    }
  )

  test.each([
    // [originalTime, meetingTime, expected]
    ["12:30", 0, "Peli alkaa: 12:30"],
    ["12:30", 30, "Lämppä: 12:00, Peli alkaa: 12:30"],
    ["00:15", 30, "Lämppä: 23:45, Peli alkaa: 00:15"],
  ])("createDescription: %s meeting=%d → %s", (time, meeting, expected) => {
    expect(excelUtils.createDescription(time, meeting)).toBe(expected)
  })

  describe("parseExcelBuffer", () => {
    const mockFields = {
      year: "2024",
      duration: "90",
      meetingTime: "30",
      group: "Test Team",
      eventType: "Ottelu",
      registration: "Valituille henkilöille",
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should parse valid Excel data successfully", () => {
      const mockData = [
        {
          Pvm: "14.12",
          Klo: "18:30",
          Kenttä: "Test Arena",
          Koti: "Team A",
          Vieras: "Team B",
          Sarja: "I divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, mockFields)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        Nimi: "I div. Team A - Team B",
        Ryhmä: "Test Team",
        Tapahtumatyyppi: "Ottelu",
        Tapahtumapaikka: "Test Arena",
        Ilmoittautuminen: "Valituille henkilöille",
        Näkyvyys: "Ryhmälle",
      })
      expect(result[0].Alkaa).toContain("2024")
      expect(result[0].Päättyy).toContain("2024")
      expect(result[0].Kuvaus).toContain("Lämppä:")
    })

    it("should use default values when fields are missing", () => {
      const mockData = [
        {
          Pvm: "14.12",
          Klo: "18:30",
          Kenttä: "Arena",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, {})

      expect(result).toHaveLength(1)
      expect(result[0].Ryhmä).toBe("")
      expect(result[0].Tapahtumatyyppi).toBe("Ottelu")
      expect(result[0].Ilmoittautuminen).toBe("Valituille henkilöille")
      expect(result[0].Alkaa).toContain(new Date().getFullYear().toString())
    })

    it("should filter out rows with missing required fields", () => {
      const mockData = [
        {
          Pvm: "14.12",
          Klo: "18:30",
          Kenttä: "Arena",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
        {
          Pvm: "",
          Klo: "19:00",
          Kenttä: "Arena",
          Koti: "C",
          Vieras: "D",
          Sarja: "II divisioona",
        },
        {
          Pvm: "15.12",
          Klo: "",
          Kenttä: "Arena",
          Koti: "E",
          Vieras: "F",
          Sarja: "III divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, mockFields)

      expect(result).toHaveLength(1)
      expect(result[0].Nimi).toContain("A - B")
    })

    it("should throw error when no valid rows are processed", () => {
      const mockData = [
        { Pvm: "", Klo: "" },
        { Pvm: "14.12", Klo: "" },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")

      expect(() => excelUtils.parseExcelBuffer(buffer, mockFields)).toThrow(EXCEL_VALIDATION_ERROR)
    })

    it("should handle rows with processing errors gracefully", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()

      const mockData = [
        {
          Pvm: "14.12",
          Klo: "18:30",
          Kenttä: "Arena",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
        {
          Pvm: "invalid-date",
          Klo: "19:00",
          Kenttä: "Arena",
          Koti: "C",
          Vieras: "D",
          Sarja: "II divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, mockFields)

      expect(result).toHaveLength(1)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Warning: Error processing row:",
        expect.any(String)
      )

      consoleWarnSpy.mockRestore()
    })

    it("should handle non-Error exceptions during processing", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()

      const mockData = [
        {
          Pvm: "14.12",
          Klo: "18:30",
          Kenttä: "Arena",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      // Mock normalizeDate to throw a non-Error
      const originalNormalizeDate = excelUtils.normalizeDate
      excelUtils.normalizeDate = jest.fn(() => {
        // eslint-disable-next-line no-throw-literal
        throw "string error"
      })

      const buffer = Buffer.from("test")

      // Should throw validation error since all rows fail
      expect(() => excelUtils.parseExcelBuffer(buffer, mockFields)).toThrow(EXCEL_VALIDATION_ERROR)

      expect(consoleWarnSpy).toHaveBeenCalledWith("Warning: Error processing row:", "string error")

      excelUtils.normalizeDate = originalNormalizeDate
      consoleWarnSpy.mockRestore()
    })

    it("should handle empty venue field", () => {
      const mockData = [
        {
          Pvm: 14.12,
          Klo: "18:30",
          Kenttä: "",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, mockFields)

      expect(result).toHaveLength(1)
      expect(result[0].Tapahtumapaikka).toBe("")
    })

    it("should process multiple valid rows", () => {
      const mockData = [
        {
          Pvm: 14.12,
          Klo: "18:30",
          Kenttä: "Arena 1",
          Koti: "A",
          Vieras: "B",
          Sarja: "I divisioona",
        },
        {
          Pvm: 15.12,
          Klo: "19:00",
          Kenttä: "Arena 2",
          Koti: "C",
          Vieras: "D",
          Sarja: "II divisioona",
        },
        {
          Pvm: 16.12,
          Klo: "20:00",
          Kenttä: "Arena 3",
          Koti: "E",
          Vieras: "F",
          Sarja: "harrastesarja",
        },
      ]

      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockXLSX.utils.sheet_to_json.mockReturnValue(mockData)

      const buffer = Buffer.from("test")
      const result = excelUtils.parseExcelBuffer(buffer, mockFields)

      expect(result).toHaveLength(3)
      expect(result[0].Nimi).toContain("I div.")
      expect(result[1].Nimi).toContain("II div.")
      expect(result[2].Nimi).not.toContain("div.")
    })
  })
})
