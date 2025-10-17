import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EncryptionService } from "@/lib/security/encryption"
import { AuditLogger } from "@/lib/security/audit-logger"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, operation } = await req.json()

    if (!text || !operation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (operation !== "encrypt" && operation !== "decrypt") {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    let result: string

    if (operation === "encrypt") {
      result = EncryptionService.encrypt(text)
      await AuditLogger.logUserAction(session.user.id, "encrypt_data", "encryption", undefined, {
        dataLength: text.length,
      })
    } else {
      result = EncryptionService.decrypt(text)
      await AuditLogger.logUserAction(session.user.id, "decrypt_data", "encryption", undefined, {
        dataLength: result.length,
      })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Encryption operation error:", error)
    return NextResponse.json({ error: "Encryption operation failed" }, { status: 500 })
  }
}
