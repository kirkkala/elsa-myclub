import { NextResponse } from "next/server"

import { formatErrorMessage, logError } from "./error"
import { excelUtils, type MyClubExcelRow } from "./excel"

// Thrown when one uploaded file cannot be converted, so the UI can point it out
class FileConversionError extends Error {
  constructor(
    readonly fileName: string,
    cause: unknown
  ) {
    super(`Tiedosto "${fileName}": ${cause instanceof Error ? cause.message : String(cause)}`, {
      cause,
    })
  }
}

/**
 * Shared body of the preview and upload API routes: reads the uploaded eLSA
 * files and form fields, converts them to MyClub rows and hands the rows to
 * `respond`. Missing files and conversion errors become JSON error responses.
 */
export async function convertRequest(
  request: Request,
  respond: (rows: MyClubExcelRow[]) => Response
): Promise<Response> {
  try {
    const fields: Record<string, string> = {}
    const files: File[] = []

    for (const [key, value] of (await request.formData()).entries()) {
      if (value instanceof File) {
        files.push(value)
      } else {
        fields[key] = value
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ message: "No files provided" }, { status: 400 })
    }

    const rowsPerFile = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        try {
          return excelUtils.parseExcelBuffer(buffer, fields)
        } catch (error) {
          throw new FileConversionError(file.name, error)
        }
      })
    )
    const rows = rowsPerFile.flat()

    // The same game can be in several files (e.g. the same export added twice);
    // keep one copy so it is not imported to MyClub as duplicate events.
    const uniqueRows = new Map(rows.map((row) => [JSON.stringify(row), row]))
    return respond([...uniqueRows.values()])
  } catch (error) {
    logError(error)
    return NextResponse.json(
      {
        message: formatErrorMessage(error),
        fileName: error instanceof FileConversionError ? error.fileName : undefined,
      },
      { status: 500 }
    )
  }
}
