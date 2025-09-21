import { excelUtils } from "@/utils/excel"
import { EXCEL_FILE_MISSING_ERROR, EXCEL_VALIDATION_ERROR } from "@/utils/error"
import { promises as fs } from "fs"
import * as XLSX from "xlsx"
import type { Fields, Files } from "formidable"

// Mock fs and XLSX
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}))

jest.mock("xlsx", () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}))

const mockFs = fs as jest.Mocked<typeof fs>
const mockXLSX = XLSX as jest.Mocked<typeof XLSX>
const mockSheetToJson = mockXLSX.utils.sheet_to_json as jest.MockedFunction<
  typeof XLSX.utils.sheet_to_json
>

describe("Excel conversion utils", () => {
  describe("formatEventName", () => {
    it("formats game title correctly from eLSA format", () => {
      const input = {
        sarja: "12-vuotiaat tytöt I divisioona Eteläinen alue",
        koti: "Puhu Juniorit",
        vieras: "HNMKY/Stadi",
      }

      expect(excelUtils.formatEventName(input.sarja, input.koti, input.vieras)).toBe(
        "I div. Puhu Juniorit - HNMKY/Stadi"
      )
    })

    it("handles different division numbers", () => {
      const input = {
        sarja: "12-vuotiaat tytöt III divisioona Eteläinen alue",
        koti: "HNMKY/Stadi",
        vieras: "Beat Basket Black",
      }

      expect(excelUtils.formatEventName(input.sarja, input.koti, input.vieras)).toBe(
        "III div. HNMKY/Stadi - Beat Basket Black"
      )
    })

    test.each([
      [
        "11-vuotiaat tytöt I divisioona Eteläinen alue",
        "Puhu Juniorit",
        "HNMKY/Stadi",
        "I div. Puhu Juniorit - HNMKY/Stadi",
      ],
      [
        "11-vuotiaat tytöt III divisioona Eteläinen alue",
        "HNMKY/Stadi",
        "Beat Basket Black",
        "III div. HNMKY/Stadi - Beat Basket Black",
      ],
    ])('converts "%s" game correctly', (sarja, koti, vieras, expected) => {
      expect(excelUtils.formatEventName(sarja, koti, vieras)).toBe(expected)
    })
  })

  describe("formatSeriesName", () => {
    it("extracts 1st division from full series name", () => {
      expect(excelUtils.formatSeriesName("11-vuotiaat tytöt I divisioona Eteläinen alue")).toBe(
        "I div."
      )
    })

    it("extracts 1st division from full series name", () => {
      expect(excelUtils.formatSeriesName("12-vuotiaat tytöt I divisioona Eteläinen alue")).toBe(
        "I div."
      )
    })

    it("extracts 2nd division from full series name", () => {
      expect(excelUtils.formatSeriesName("12-vuotiaat tytöt II divisioona Eteläinen alue")).toBe(
        "II div."
      )
    })

    it("extracts 3rd division from full series name", () => {
      expect(excelUtils.formatSeriesName("9-vuotiaat tytöt III divisioona Eteläinen alue")).toBe(
        "III div."
      )
    })

    it("returns empty string for series we don't expect", () => {
      expect(excelUtils.formatSeriesName("100-vuotiaat leidit harrastesarja")).toBe("")
    })
  })
})

describe("Date and time conversions", () => {
  describe("normalizeDate", () => {
    it("handles string dates with comma", () => {
      expect(excelUtils.normalizeDate("14,12")).toBe("14.12.")
    })

    it("handles string dates with dot", () => {
      expect(excelUtils.normalizeDate("14.12")).toBe("14.12.")
    })

    it("handles string dates with dot", () => {
      expect(excelUtils.normalizeDate("14.12")).toBe("14.12.")
    })

    it("handles numeric dates", () => {
      expect(excelUtils.normalizeDate(14.12)).toBe("14.12.")
    })

    it("pads single digit dates", () => {
      expect(excelUtils.normalizeDate("4,3")).toBe("04.03.")
      expect(excelUtils.normalizeDate(4.03)).toBe("04.03.")
    })

    it("throws error for invalid date format", () => {
      expect(() => excelUtils.normalizeDate("invalid")).toThrow("Odottamaton päivämäärämuoto")
    })
  })

  describe("formatDateTime", () => {
    it("combines date, time and year (as string)", () => {
      expect(excelUtils.formatDateTime("14.12.", "12:30", "2025")).toBe("14.12.2025 12:30:00")
    })

    it("works with numeric year", () => {
      expect(excelUtils.formatDateTime("14.12.", "12:30", 2025)).toBe("14.12.2025 12:30:00")
    })
  })

  describe("calculateEventTimes", () => {
    it("calculates start and end times with no adjustments", () => {
      expect(excelUtils.calculateEventTimes("12:30", 0, 120)).toEqual({
        startTime: "12:30",
        endTime: "14:30",
      })
    })

    it("handles meeting time adjustment", () => {
      expect(excelUtils.calculateEventTimes("12:30", 30, 120)).toEqual({
        startTime: "12:00",
        endTime: "14:30",
      })
    })

    it("handles hour rollover for end time", () => {
      expect(excelUtils.calculateEventTimes("23:30", 0, 60)).toEqual({
        startTime: "23:30",
        endTime: "00:30",
      })
    })

    it("handles hour rollover for start time", () => {
      expect(excelUtils.calculateEventTimes("00:30", 30, 60)).toEqual({
        startTime: "00:00",
        endTime: "01:30",
      })
    })
  })

  describe("adjustStartTime", () => {
    it("subtracts given minutes from time", () => {
      expect(excelUtils.adjustStartTime("12:30", 15)).toBe("12:15")
    })

    it("handles hour rollover when subtracting", () => {
      expect(excelUtils.adjustStartTime("00:15", 30)).toBe("23:45")
    })

    it("handles time with spaces", () => {
      expect(excelUtils.adjustStartTime("12: 30", 15)).toBe("12:15")
    })

    it("returns original time when no adjustment", () => {
      expect(excelUtils.adjustStartTime("12:30", 0)).toBe("12:30")
    })
  })

  describe("createDescription", () => {
    it("creates description with only game start time when no meeting time", () => {
      expect(excelUtils.createDescription("12:30", 0)).toBe("Peli alkaa: 12:30")
    })

    it("creates description with warmup and game start time", () => {
      expect(excelUtils.createDescription("12:30", 30)).toBe("Lämppä: 12:00, Peli alkaa: 12:30")
    })

    it("handles hour rollover in warmup time", () => {
      expect(excelUtils.createDescription("00:15", 30)).toBe("Lämppä: 23:45, Peli alkaa: 00:15")
    })
  })
})

describe("parseExcelFile", () => {
  const mockFields: Fields = {
    year: ["2024"],
    duration: ["90"],
    meetingTime: ["30"],
    group: ["Test Group"],
    eventType: ["Ottelu"],
    registration: ["Valituille henkilöille"],
  }

  const mockFile = {
    filepath: "/tmp/test.xlsx",
  } as { filepath: string }

  const mockFiles: Files = {
    file: mockFile,
  }

  const mockExcelData = [
    {
      Pvm: "14.12",
      Klo: "12:30",
      Kenttä: "Namika Areena LIIKE ON LÄÄKE B",
      Koti: "Team A",
      Vieras: "Team B",
      Sarja: "12-vuotiaat tytöt I divisioona Eteläinen alue",
    },
    {
      Pvm: "15.12",
      Klo: "14:00",
      Kenttä: "Another Venue",
      Koti: "Team C",
      Vieras: "Team D",
      Sarja: "12-vuotiaat tytöt II divisioona Eteläinen alue",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockFs.readFile.mockResolvedValue(Buffer.from("mock excel data"))
    mockXLSX.read.mockReturnValue({
      Sheets: { Sheet1: {} },
      SheetNames: ["Sheet1"],
    } as XLSX.WorkBook)
    mockSheetToJson.mockReturnValue(mockExcelData)
  })

  it("throws error when no file is provided", async () => {
    await expect(excelUtils.parseExcelFile(mockFields, {})).rejects.toThrow(
      EXCEL_FILE_MISSING_ERROR
    )
  })

  it("throws error when file array is empty", async () => {
    await expect(excelUtils.parseExcelFile(mockFields, { file: [] })).rejects.toThrow(
      EXCEL_FILE_MISSING_ERROR
    )
  })

  it("processes Excel file successfully", async () => {
    const result = await excelUtils.parseExcelFile(mockFields, mockFiles)

    expect(mockFs.readFile).toHaveBeenCalledWith("/tmp/test.xlsx")
    expect(mockXLSX.read).toHaveBeenCalled()
    expect(mockXLSX.utils.sheet_to_json).toHaveBeenCalled()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      Nimi: "I div. Team A - Team B",
      Alkaa: "14.12.2024 12:00:00",
      Päättyy: "14.12.2024 14:00:00",
      Ryhmä: "Test Group",
      Kuvaus: "Lämppä: 12:00, Peli alkaa: 12:30",
      Tapahtumatyyppi: "Ottelu",
      Tapahtumapaikka: "Namika Areena LIIKE ON LÄÄKE B",
      Ilmoittautuminen: "Valituille henkilöille",
      Näkyvyys: "Näkyy ryhmälle",
    })
  })

  it("handles file array with single file", async () => {
    const filesArray: Files = { file: [mockFile] }
    const result = await excelUtils.parseExcelFile(mockFields, filesArray)

    expect(result).toHaveLength(2)
    expect(mockFs.readFile).toHaveBeenCalledWith("/tmp/test.xlsx")
  })

  it("uses default values when fields are missing", async () => {
    const minimalFields: Fields = {}
    const result = await excelUtils.parseExcelFile(minimalFields, mockFiles)

    expect(result[0].Ryhmä).toBe("")
    expect(result[0].Tapahtumatyyppi).toBe("")
    expect(result[0].Ilmoittautuminen).toBe("")
    expect(result[0].Alkaa).toContain(new Date().getFullYear().toString())
  })

  it("filters out rows with missing required data", async () => {
    const incompleteData = [
      ...mockExcelData,
      { Pvm: "", Klo: "12:30", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" }, // Missing Pvm
      { Pvm: "16.12", Klo: "", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" }, // Missing Klo
      { Pvm: "17.12", Klo: "15:00", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" }, // Valid
    ]

    mockSheetToJson.mockReturnValue(incompleteData)

    const result = await excelUtils.parseExcelFile(mockFields, mockFiles)

    // Should have 3 valid rows (2 original + 1 valid from incomplete data)
    expect(result).toHaveLength(3)
  })

  it("handles date format errors gracefully", async () => {
    const invalidDateData = [
      { Pvm: "invalid-date", Klo: "12:30", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" },
      ...mockExcelData, // Valid data
    ]

    mockSheetToJson.mockReturnValue(invalidDateData)

    // Mock console.warn to avoid noise in tests
    const mockWarn = jest.spyOn(console, "warn").mockImplementation(() => {})

    const result = await excelUtils.parseExcelFile(mockFields, mockFiles)

    // Should only have the 2 valid rows
    expect(result).toHaveLength(2)
    expect(mockWarn).toHaveBeenCalledWith(
      "Warning: Error processing row:",
      expect.stringContaining("Odottamaton päivämäärämuoto")
    )

    mockWarn.mockRestore()
  })

  it("throws validation error when no valid rows are processed", async () => {
    const invalidData = [
      { Pvm: "", Klo: "", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" },
      { Pvm: "invalid", Klo: "12:30", Kenttä: "Test", Koti: "A", Vieras: "B", Sarja: "Test" },
    ]

    mockSheetToJson.mockReturnValue(invalidData)

    // Mock console.warn to avoid noise in tests
    const mockWarn = jest.spyOn(console, "warn").mockImplementation(() => {})

    await expect(excelUtils.parseExcelFile(mockFields, mockFiles)).rejects.toThrow(
      EXCEL_VALIDATION_ERROR
    )

    mockWarn.mockRestore()
  })

  it("handles numeric field values", async () => {
    const numericFields: Fields = {
      year: ["2024"],
      duration: ["120"],
      meetingTime: ["45"],
      group: ["Test Group"],
      eventType: ["Ottelu"],
      registration: ["Valituille henkilöille"],
    }

    const result = await excelUtils.parseExcelFile(numericFields, mockFiles)

    expect(result[0].Alkaa).toContain("2024")
    expect(result[0].Päättyy).toContain("2024")
    // Duration should be 120 minutes (2 hours)
    expect(result[0].Päättyy).toContain("14:30") // 12:30 + 2 hours
  })
})
