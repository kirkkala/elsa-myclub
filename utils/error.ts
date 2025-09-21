// Excel file validation errors
export const EXCEL_VALIDATION_ERROR =
  "Tarkista että eLSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja että tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras). Tarvittaessa ole yhteydessä ylläpitäjään."
export const EXCEL_DATE_FORMAT_ERROR = (date: string | number) =>
  `Odottamaton päivämäärämuoto: ${date}`
export const EXCEL_FILE_MISSING_ERROR = "Ei lisättyä tiedostoa"

// API response errors
export const API_METHOD_NOT_ALLOWED = "Method not allowed"
export const API_CONVERSION_FAILED = "Tiedoston muunnos epäonnistui"
export const API_FILE_MISSING = "Tiedosto puuttuu"

// Generic error formatter
export const formatErrorMessage = (error: unknown): string => {
  return `Tiedoston prosessointi epäonnistui. ${error instanceof Error ? error.message : String(error)}`
}

// Error logging utility
export const logError = (error: unknown): void => {
  console.error("Detailed error:", error)
}
