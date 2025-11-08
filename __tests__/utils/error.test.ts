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

// Store original console.error to work with jest.setup.js
const originalConsoleError = console.error
const mockConsoleError = jest.fn()

describe("Error utilities", () => {
  beforeAll(() => {
    // Override console.error for this test suite
    console.error = mockConsoleError
  })

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError
  })

  beforeEach(() => mockConsoleError.mockClear())

  it("exports correct constants", () => {
    expect(EXCEL_VALIDATION_ERROR).toContain("Tarkista että eLSA:sta hakemasi")
    expect(EXCEL_FILE_MISSING_ERROR).toBe("Ei lisättyä tiedostoa")
    expect(API_METHOD_NOT_ALLOWED).toBe("Method not allowed")
    expect(API_CONVERSION_FAILED).toBe("Tiedoston muunnos epäonnistui")
    expect(API_FILE_MISSING).toBe("Tiedosto puuttuu")
    expect(EXCEL_DATE_FORMAT_ERROR("test")).toBe("Odottamaton päivämäärämuoto: test")
  })

  it("formats error messages", () => {
    expect(formatErrorMessage(new Error("Test"))).toBe("Tiedoston prosessointi epäonnistui. Test")
    expect(formatErrorMessage("String")).toBe("Tiedoston prosessointi epäonnistui. String")
    expect(formatErrorMessage(null)).toBe("Tiedoston prosessointi epäonnistui. null")
    expect(formatErrorMessage(123)).toBe("Tiedoston prosessointi epäonnistui. 123")
  })

  it("logs errors", () => {
    const error = new Error("Test")
    logError(error)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", error)

    logError("String")
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", "String")

    logError(null)
    expect(mockConsoleError).toHaveBeenCalledWith("Detailed error:", null)
  })
})
