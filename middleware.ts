import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { apiRateLimiter, authRateLimiter } from "@/lib/security/rate-limiter"
import { AuditLogger } from "@/lib/security/audit-logger"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
    const isApiRoute = req.nextUrl.pathname.startsWith("/api")

    // Get client IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"

    // Rate limiting for API routes
    if (isApiRoute) {
      const rateLimitResult = await apiRateLimiter.checkLimit(ip)

      if (!rateLimitResult.allowed) {
        await AuditLogger.logSecurityEvent("rate_limit_exceeded", "warning", {
          ip,
          path: req.nextUrl.pathname,
          remaining: rateLimitResult.remaining,
        })

        return new NextResponse(
          JSON.stringify({
            error: "Too many requests",
            retryAfter: rateLimitResult.resetAt.toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": apiRateLimiter["config"].maxRequests.toString(),
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
              "X-RateLimit-Reset": rateLimitResult.resetAt.toISOString(),
            },
          },
        )
      }

      // Add rate limit headers to response
      const response = NextResponse.next()
      response.headers.set("X-RateLimit-Limit", apiRateLimiter["config"].maxRequests.toString())
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimitResult.resetAt.toISOString())
    }

    // Rate limiting for auth routes
    if (isAuthPage) {
      const rateLimitResult = await authRateLimiter.checkLimit(ip)

      if (!rateLimitResult.allowed) {
        await AuditLogger.logSecurityEvent("auth_rate_limit_exceeded", "warning", {
          ip,
          path: req.nextUrl.pathname,
        })

        return NextResponse.redirect(new URL("/login?error=too_many_attempts", req.url))
      }

      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }

    // Check role-based access
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin" && token.role !== "super_admin") {
        await AuditLogger.logSecurityEvent("unauthorized_admin_access", "warning", {
          userId: token.id as string,
          role: token.role as string,
          path: pathname,
          ip,
        })

        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Log successful access for sensitive routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      await AuditLogger.logUserAction(token.id as string, "access", "admin_route", pathname, {
        ip,
        userAgent: req.headers.get("user-agent") || undefined,
      })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

        if (isAuthPage) {
          return true
        }

        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/api/:path*"],
}
