import { NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"
import { excelUtils } from "@/utils/excel"
import { formatErrorMessage, logError } from "@/utils/error"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract fields and files from FormData
    const fields: Record<string, string> = {}
    let fileBuffer: Buffer | null = null

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileBuffer = Buffer.from(await value.arrayBuffer())
      } else {
        fields[key] = value
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    const processedData = excelUtils.parseExcelBuffer(fileBuffer, fields)

    return NextResponse.json({ data: processedData })
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
