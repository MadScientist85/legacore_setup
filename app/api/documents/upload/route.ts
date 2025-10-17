import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"
import { supabaseAdmin } from "@/lib/supabase/client"
import { documentProcessor } from "@/lib/document/processor"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const companyId = formData.get("companyId") as string
    const category = (formData.get("category") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const filename = `${companyId}/documents/${Date.now()}-${file.name}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
    })

    // Process document
    let processedText = ""
    let metadata: any = {}
    let analysis: any = null

    try {
      const processed = await documentProcessor.processFile(buffer, file.type, file.name)
      processedText = processed.text
      metadata = processed.metadata

      // Analyze document
      analysis = await documentProcessor.analyzeDocument(processedText, category)
    } catch (error) {
      console.error("Document processing error:", error)
      // Continue without processing if it fails
    }

    // Get user
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("email", session.user.email).single()

    // Save to database
    const { data: document, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert({
        company_id: companyId,
        user_id: user?.id,
        filename: file.name,
        file_url: blob.url,
        file_type: file.type,
        file_size: file.size,
        category,
        extracted_text: processedText,
        metadata,
        analysis,
        status: "processed",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      throw dbError
    }

    return NextResponse.json({
      success: true,
      document,
    })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
