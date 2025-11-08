import { excelUtils } from "@/utils/excel"
import { EXCEL_FILE_MISSING_ERROR, EXCEL_VALIDATION_ERROR } from "@/utils/error"
import { promises as fs } from "fs"
import * as XLSX from "xlsx"
import type { Fields, Files } from "formidable"

jest.mock("fs", () => ({ promises: { readFile: jest.fn() } }))
jest.mock("xlsx", () => ({ read: jest.fn(), utils: { sheet_to_json: jest.fn() } }))

const mockFs = fs as jest.Mocked<typeof fs>
const mockXLSX = XLSX as jest.Mocked<typeof XLSX>
const mockSheetToJson = mockXLSX.utils.sheet_to_json as jest.MockedFunction<
  typeof XLSX.utils.sheet_to_json
>

// Helper for mocking console methods
const mockConsoleMethod = (method: "warn" | "error") => {
  const mockMethod = jest.spyOn(console, method).mockImplementation(() => {})

  return {
    mock: mockMethod,
    restore: () => {
      mockMethod.mockRestore()
    },
  }
}

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
    // [time, adjustment, expected]
    ["12:30", 15, "12:15"],
    ["00:15", 30, "23:45"],
    ["12: 30", 15, "12:15"],
    ["12:30", 0, "12:30"],
  ])("adjustStartTime: %s -%d min → %s", (time, adjustment, expected) => {
    expect(excelUtils.adjustStartTime(time, adjustment)).toBe(expected)
  })

  test.each([
    // [originalTime, meetingTime, expected]
    ["12:30", 0, "Peli alkaa: 12:30"],
    ["12:30", 30, "Lämppä: 12:00, Peli alkaa: 12:30"],
    ["00:15", 30, "Lämppä: 23:45, Peli alkaa: 00:15"],
  ])("createDescription: %s meeting=%d → %s", (time, meeting, expected) => {
    expect(excelUtils.createDescription(time, meeting)).toBe(expected)
  })

  describe("parseExcelFile", () => {
    const mockFields: Fields = { year: ["2024"], group: ["Test Group"], eventType: ["Ottelu"] }
    const mockFiles: Files = {
      file: {
        filepath: "/tmp/test.xlsx",
        originalFilename: "test.xlsx",
        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1024,
      } as unknown as Files["file"],
    }
    const mockData = [
      {
        Pvm: "14.12",
        Klo: "12:30",
        Kenttä: "Venue",
        Koti: "A",
        Vieras: "B",
        Sarja: "I divisioona",
      },
    ]

    beforeEach(() => {
      jest.clearAllMocks()
      mockFs.readFile.mockResolvedValue(Buffer.from("data"))
      mockXLSX.read.mockReturnValue({
        Sheets: { Sheet1: {} },
        SheetNames: ["Sheet1"],
      } as XLSX.WorkBook)
      mockSheetToJson.mockReturnValue(mockData)
    })

    test.each([
      [{}, EXCEL_FILE_MISSING_ERROR],
      [{ file: [] }, EXCEL_FILE_MISSING_ERROR],
    ])("throws error for missing file: %o", async (files, expectedError) => {
      await expect(excelUtils.parseExcelFile(mockFields, files)).rejects.toThrow(expectedError)
    })

    it("processes Excel file successfully", async () => {
      const result = await excelUtils.parseExcelFile(mockFields, mockFiles)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        Nimi: "I div. A - B",
        Ryhmä: "Test Group",
        Alkaa: expect.stringContaining("2024"),
      })
    })

    it("uses default values for missing fields", async () => {
      const fieldsWithMissingValues: Fields = {}
      const result = await excelUtils.parseExcelFile(fieldsWithMissingValues, mockFiles)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        Ryhmä: "", // Default empty string when fields.group is undefined
        Tapahtumatyyppi: "Ottelu", // Default "Ottelu" when fields.eventType is undefined
        Alkaa: expect.stringContaining(new Date().getFullYear().toString()), // Default current year when fields.year is undefined
      })
    })

    it("handles errors and missing data", async () => {
      const consoleMock = mockConsoleMethod("warn")

      // Missing required fields are filtered out
      mockSheetToJson.mockReturnValueOnce([{ Pvm: "", Klo: "" }, ...mockData])
      expect(await excelUtils.parseExcelFile(mockFields, mockFiles)).toHaveLength(1)

      // Test validation error when no valid rows (covers line 161)
      mockSheetToJson.mockReturnValueOnce([{ Pvm: "", Klo: "" }]) // Only invalid data
      await expect(excelUtils.parseExcelFile(mockFields, mockFiles)).rejects.toThrow(
        EXCEL_VALIDATION_ERROR
      )

      consoleMock.restore()
    })

    it("handles non-Error exceptions with String conversion", async () => {
      const consoleMock = mockConsoleMethod("warn")

      // Use data that will definitely trigger the error
      const invalidData = [
        {
          Pvm: "15.12",
          Klo: "13:30",
          Kenttä: "Venue2",
          Koti: "C",
          Vieras: "D",
          Sarja: "II divisioona",
        },
      ]
      mockSheetToJson.mockReturnValueOnce(invalidData)

      // Mock normalizeDate to throw a number (non-Error object)
      const original = excelUtils.normalizeDate
      excelUtils.normalizeDate = jest.fn(() => {
        // eslint-disable-next-line no-throw-literal
        throw 42 // Throw a number, not an Error
      })

      await expect(excelUtils.parseExcelFile(mockFields, mockFiles)).rejects.toThrow(
        EXCEL_VALIDATION_ERROR
      )

      // Verify the String(err) branch was hit - number should be converted to "42"
      expect(consoleMock.mock).toHaveBeenCalledWith("Warning: Error processing row:", "42")

      excelUtils.normalizeDate = original
      consoleMock.restore()
    })
  })
})
