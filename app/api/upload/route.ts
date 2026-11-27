import * as XLSX from "xlsx"

import { convertRequest } from "@/utils/convertRequest"

export function POST(request: Request) {
  return convertRequest(request, (rows) => {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "MyClub Import")

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": 'attachment; filename="elsa-myclub-import.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  })
}
