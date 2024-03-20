import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const requireAuth: string[] = [
  "/chat",
  "/api",
  "/reporting",
  "/settings",
  "/tenant",
  "/admin",
  "/prompt-guide",
  "/what's-new",
  "/persona",
  "/prompt",
]
const requireAdmin: string[] = ["/reporting", "/admin", "/settings", "/tenant"]

export async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  if (requireAuth.some(path => pathname.startsWith(path))) {
    const token = await getToken({ req: request })

    if (!token) {
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }

    const now = Math.floor(Date.now() / 1000)
    if (token.exp && typeof token.exp === "number" && token.exp < now) {
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }

    if (requireAdmin.some(path => pathname.startsWith(path)) && !token.qchatAdmin) {
      const url = new URL("/unauthorised", request.url)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/chat/:path*",
    "/api/images/:path*",
    "/chat/:path*",
    "/persona/:path*",
    "/prompt-guide/:path*",
    "/prompt/:path*",
    "/reporting/:path*",
    "/settings/:path*",
    "/tenant/:path*",
    "/unauthorised/:path*",
    "/what's-new/:path*",
  ],
}
