import { getToken } from "next-auth/jwt"
import { type NextRequest, NextResponse } from "next/server"

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/api/auth"]
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (!token && !isPublicRoute) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (token) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    if (isAdminRoute && token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
}
