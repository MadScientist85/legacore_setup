import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const companyId = formData.get("companyId") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      const filename = `${companyId}/${Date.now()}-${file.name}`
      const blob = await put(filename, file, {
        access: "public",
      })

      uploadedFiles.push({
        name: file.name,
        url: blob.url,
        type: file.type,
      })
    }

    return NextResponse.json({ files: uploadedFiles })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
