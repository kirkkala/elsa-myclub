import { IncomingForm, Fields, Files } from "formidable"
import * as XLSX from "xlsx"
import type { NextApiRequest, NextApiResponse } from "next"
import { excelUtils } from "@/utils/excel"
import { formatErrorMessage, API_METHOD_NOT_ALLOWED, logError } from "@/utils/error"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: API_METHOD_NOT_ALLOWED })
  }

  try {
    const form = new IncomingForm()
    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, formFields, formFiles) => {
        if (err) {
          reject(new Error(String(err)))
        }
        resolve([formFields, formFiles])
      })
    })

    const processedData = await excelUtils.parseExcelFile(fields, files)

    const newWorkbook = XLSX.utils.book_new()
    const newSheet = XLSX.utils.json_to_sheet(processedData)
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "MyClub Import")

    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" }) as Buffer

    const filename = "elsa-myclub-import.xlsx"
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.send(buffer)
    return
  } catch (error) {
    logError(error)
    res.status(500).json({
      message: formatErrorMessage(error),
    })
    return
  }
}

