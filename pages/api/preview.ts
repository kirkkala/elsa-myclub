import { IncomingForm, Fields, Files } from "formidable"
import type { NextApiHandler } from "next"
import { excelUtils } from "@/utils/excel"
import { formatErrorMessage, API_METHOD_NOT_ALLOWED, logError } from "@/utils/error"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler: NextApiHandler = async (req, res) => {
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
    return res.status(200).json({ data: processedData })
  } catch (error) {
    logError(error)
    return res.status(500).json({
      message: formatErrorMessage(error),
    })
  }
}

export default handler
