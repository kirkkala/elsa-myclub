import { Buffer } from "buffer"

import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

import { formatErrorMessage, logError } from "@/utils/error"
import { excelUtils, type MyClubExcelRow } from "@/utils/excel"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract fields and files from FormData
    const fields: Record<string, string> = {}
    const fileBuffers: Buffer[] = []

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileBuffers.push(Buffer.from(await value.arrayBuffer()))
      } else {
        fields[key] = value
      }
    }

    if (fileBuffers.length === 0) {
      return NextResponse.json({ message: "No files provided" }, { status: 400 })
    }

    // Process all files and merge results
    const allData: MyClubExcelRow[] = []
    for (const fileBuffer of fileBuffers) {
      const processedData = excelUtils.parseExcelBuffer(fileBuffer, fields)
      allData.push(...processedData)
    }

    const newWorkbook = XLSX.utils.book_new()
    const newSheet = XLSX.utils.json_to_sheet(allData)
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "MyClub Import")

    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" }) as Buffer

    const filename = "elsa-myclub-import.xlsx"

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
