import {
  API_CONVERSION_FAILED,
  API_FILE_MISSING,
  EXCEL_DATE_FORMAT_ERROR,
  EXCEL_VALIDATION_ERROR,
  formatErrorMessage,
  logError,
} from "@/utils/error"

// Store original console.error to work with vitest.setup.ts
const originalConsoleError = console.error
const mockConsoleError = vi.fn()

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
    expect(API_CONVERSION_FAILED).toBe("Tiedoston muunnos epäonnistui")
    expect(API_FILE_MISSING).toBe("Tiedosto puuttuu")
    expect(EXCEL_DATE_FORMAT_ERROR("test")).toBe("Odottamaton päivämäärämuoto: test")
  })

  it("formats error messages", () => {
    expect(formatErrorMessage(new Error("Test"))).toBe("Test")
    expect(formatErrorMessage("String")).toBe("String")
    expect(formatErrorMessage(null)).toBe("null")
    expect(formatErrorMessage(123)).toBe("123")
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
