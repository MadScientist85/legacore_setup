import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createAirtableClient } from "@/lib/integrations/airtable"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const maxRecords = searchParams.get("maxRecords")
    const view = searchParams.get("view")

    const airtable = createAirtableClient()
    const records = await airtable.listRecords({
      maxRecords: maxRecords ? Number.parseInt(maxRecords) : undefined,
      view: view || undefined,
    })

    return NextResponse.json({ success: true, records })
  } catch (error) {
    console.error("Airtable list error:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { fields } = body

    if (!fields) {
      return NextResponse.json({ error: "Fields are required" }, { status: 400 })
    }

    const airtable = createAirtableClient()
    const record = await airtable.createRecord(fields)

    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error("Airtable create error:", error)
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
