import { IncomingForm, Fields, Files } from "formidable"
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

    res.setHeader("Content-Type", "application/json")
    res.status(200).json({ data: processedData })
    return
  } catch (error) {
    logError(error)
    return res.status(500).json({
      message: formatErrorMessage(error),
    })
  }
}
