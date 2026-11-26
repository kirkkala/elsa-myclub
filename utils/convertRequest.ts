import { NextResponse } from "next/server"

import { formatErrorMessage, logError } from "./error"
import { excelUtils, type MyClubExcelRow } from "./excel"

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

    const buffers = await Promise.all(files.map((file) => file.arrayBuffer()))
    return respond(
      buffers.flatMap((buffer) => excelUtils.parseExcelBuffer(Buffer.from(buffer), fields))
    )
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
