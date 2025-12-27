import { Buffer } from "buffer"

import { NextRequest, NextResponse } from "next/server"

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

    return NextResponse.json({ data: allData })
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
