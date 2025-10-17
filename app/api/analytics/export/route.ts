import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: user } = await supabase.from("users").select("id, role").eq("email", session.user.email).single()

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "revenue"

    let data: any[] = []
    let headers: string[] = []

    switch (type) {
      case "revenue":
        const { data: payments } = await supabase
          .from("payment_history")
          .select("*")
          .order("created_at", { ascending: false })

        data = payments || []
        headers = ["Date", "Amount", "Description", "Status", "Customer Email"]
        break

      case "users":
        const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        data = users || []
        headers = ["Email", "Full Name", "Role", "Created At", "Last Login"]
        break

      case "documents":
        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .order("created_at", { ascending: false })

        data = documents || []
        headers = ["Name", "Category", "Size", "Uploaded At"]
        break

      default:
        return NextResponse.json({ error: "Invalid export type" }, { status: 400 })
    }

    // Convert to CSV
    const csvRows = [headers.join(",")]

    for (const row of data) {
      const values = Object.values(row).map((value) => {
        const stringValue = String(value || "")
        return `"${stringValue.replace(/"/g, '""')}"`
      })
      csvRows.push(values.join(","))
    }

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-export-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
