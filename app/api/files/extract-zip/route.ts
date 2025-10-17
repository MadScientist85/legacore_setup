import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { zipExtractor } from "@/lib/utils/zip-extractor"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extractedFiles = await zipExtractor.extractZip(buffer)

    const uploadedFiles = await Promise.all(
      extractedFiles.map(async (file) => {
        const blob = await put(file.path, file.content, {
          access: "public",
          contentType: zipExtractor.getFileType(file.name),
        })

        return {
          name: file.name,
          path: file.path,
          url: blob.url,
          size: file.size,
          contentType: blob.contentType,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      count: uploadedFiles.length,
    })
  } catch (error) {
    console.error("ZIP extraction error:", error)
    return NextResponse.json({ error: "ZIP extraction failed" }, { status: 500 })
  }
}
