import { NextRequest, NextResponse } from "next/server"

import { formatErrorMessage, logError } from "@/utils/error"
import { excelUtils, type MyClubExcelRow } from "@/utils/excel"
import { parseFormData } from "@/utils/formData"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { fields, fileBuffers } = await parseFormData(formData)

    if (fileBuffers.length === 0) {
      return NextResponse.json({ message: "No files provided" }, { status: 400 })
    }

    const allData: MyClubExcelRow[] = fileBuffers.flatMap((buffer) =>
      excelUtils.parseExcelBuffer(buffer, fields)
    )

    return NextResponse.json({ data: allData })
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
