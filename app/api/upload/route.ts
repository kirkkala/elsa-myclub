import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

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

    const newWorkbook = XLSX.utils.book_new()
    const newSheet = XLSX.utils.json_to_sheet(allData)
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "MyClub Import")

    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" }) as Buffer

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": 'attachment; filename="elsa-myclub-import.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  } catch (error) {
    logError(error)
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 })
  }
}
