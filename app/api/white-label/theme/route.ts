import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { themeManager } from "@/lib/white-label/theme-manager"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get("companyId")
  const domain = searchParams.get("domain")

  try {
    let theme
    if (companyId) {
      theme = await themeManager.getThemeByCompanyId(companyId)
    } else if (domain) {
      theme = await themeManager.getThemeByDomain(domain)
    } else {
      return NextResponse.json({ error: "Company ID or domain required" }, { status: 400 })
    }

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    return NextResponse.json({ theme })
  } catch (error) {
    console.error("Error fetching theme:", error)
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { companyId, theme } = body

    if (!companyId) {
      return NextResponse.json({ error: "Company ID required" }, { status: 400 })
    }

    const updatedTheme = await themeManager.updateTheme(companyId, theme)

    if (!updatedTheme) {
      return NextResponse.json({ error: "Failed to update theme" }, { status: 500 })
    }

    return NextResponse.json({ theme: updatedTheme })
  } catch (error) {
    console.error("Error updating theme:", error)
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { theme } = body

    if (!theme.company_id) {
      return NextResponse.json({ error: "Company ID required" }, { status: 400 })
    }

    const newTheme = await themeManager.createTheme(theme)

    if (!newTheme) {
      return NextResponse.json({ error: "Failed to create theme" }, { status: 500 })
    }

    return NextResponse.json({ theme: newTheme })
  } catch (error) {
    console.error("Error creating theme:", error)
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 })
  }
}
