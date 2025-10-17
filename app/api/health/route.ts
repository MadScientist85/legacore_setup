import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(req: NextRequest) {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    services: {
      database: false,
      redis: false,
      storage: false,
    },
  }

  try {
    // Check database
    const { error: dbError } = await supabase.from("users").select("id").limit(1)
    checks.services.database = !dbError

    // Check Redis (if configured)
    if (process.env.KV_REST_API_URL) {
      try {
        const { Redis } = await import("@upstash/redis")
        const redis = new Redis({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN!,
        })
        await redis.ping()
        checks.services.redis = true
      } catch {
        checks.services.redis = false
      }
    }

    // Check Vercel Blob storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      checks.services.storage = true
    }

    const allHealthy = Object.values(checks.services).every((status) => status)
    checks.status = allHealthy ? "healthy" : "degraded"

    return NextResponse.json(checks, {
      status: allHealthy ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ...checks,
        status: "unhealthy",
        error: String(error),
      },
      { status: 503 },
    )
  }
}
