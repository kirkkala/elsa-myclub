import { NextResponse } from "next/server"

import { convertRequest } from "@/utils/convertRequest"

export function POST(request: Request) {
  return convertRequest(request, (rows) => NextResponse.json({ data: rows }))
}
