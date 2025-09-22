import {
  EXCEL_VALIDATION_ERROR,
  EXCEL_DATE_FORMAT_ERROR,
  EXCEL_FILE_MISSING_ERROR,
  API_METHOD_NOT_ALLOWED,
  API_CONVERSION_FAILED,
  API_FILE_MISSING,
  formatErrorMessage,
  logError,
} from "@/utils/error"

// Mock console.error for testing
const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {})

describe("Error constants", () => {
  it("exports correct error messages", () => {
    expect(EXCEL_VALIDATION_ERROR).toBe(
      "Tarkista että eLSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja että tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras). Tarvittaessa ole yhteydessä ylläpitäjään."
    )
    expect(EXCEL_FILE_MISSING_ERROR).toBe("Ei lisättyä tiedostoa")
    expect(API_METHOD_NOT_ALLOWED).toBe("Method not allowed")
    expect(API_CONVERSION_FAILED).toBe("Tiedoston muunnos epäonnistui")
    expect(API_FILE_MISSING).toBe("Tiedosto puuttuu")
  })

  it("generates date format error with provided date", () => {
    expect(EXCEL_DATE_FORMAT_ERROR("invalid-date")).toBe(
      "Odottamaton päivämäärämuoto: invalid-date"
    )
    expect(EXCEL_DATE_FORMAT_ERROR(123)).toBe("Odottamaton päivämäärämuoto: 123")
  })
})

describe("formatErrorMessage", () => {
  it("formats Error objects correctly", () => {
    const error = new Error("Test error message")
    expect(formatErrorMessage(error)).toBe("Tiedoston prosessointi epäonnistui. Test error message")
  })

  it("formats string errors correctly", () => {
    expect(formatErrorMessage("String error")).toBe(
      "Tiedoston prosessointi epäonnistui. String error"
    )
  })

  it("formats unknown error types correctly", () => {
    expect(formatErrorMessage(null)).toBe("Tiedoston prosessointi epäonnistui. null")
    expect(formatErrorMessage(undefined)).toBe("Tiedoston prosessointi epäonnistui. undefined")
    expect(formatErrorMessage(123)).toBe("Tiedoston prosessointi epäonnistui. 123")
    expect(formatErrorMessage({ message: "object error" })).toBe(
      "Tiedoston prosessointi epäonnistui. [object Object]"
    )
  })
})

describe("logError", () => {
  beforeEach(() => {
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  it("logs Error objects", () => {
    const error = new Error("Test error")
    logError(error)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", error)
  })

  it("logs string errors", () => {
    logError("String error")
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", "String error")
  })

  it("logs unknown error types", () => {
    const unknownError = { custom: "error" }
    logError(unknownError)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", unknownError)
  })

  it("logs null and undefined", () => {
    logError(null)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", null)

    logError(undefined)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", undefined)
  })
})
