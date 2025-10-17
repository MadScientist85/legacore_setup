import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { documentGenerator } from "@/lib/document/document-generator"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, format = "pdf", author } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const sections = typeof content === "string" ? documentGenerator.markdownToSections(content) : content

    let buffer: Buffer
    let contentType: string
    let filename: string

    if (format === "pdf") {
      buffer = await documentGenerator.generatePDF({ title, sections, author })
      contentType = "application/pdf"
      filename = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`
    } else if (format === "docx") {
      buffer = await documentGenerator.generateWord({ title, sections, author })
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      filename = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.docx`
    } else {
      return NextResponse.json({ error: "Invalid format. Use 'pdf' or 'docx'" }, { status: 400 })
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json({ error: "Document generation failed" }, { status: 500 })
  }
}
