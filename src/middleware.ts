import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { AuthToken } from "./features/auth/auth-api"

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

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const pathname = request.nextUrl.pathname

  if (requireAuth.some(path => pathname.startsWith(path))) {
    const token = (await getToken({ req: request })) as AuthToken | null

    if (!token) {
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }

    if (
      requireAdmin.some(path => pathname.startsWith(path)) &&
      (!token.qchatAdmin || !(await additionalAdminCheck(token)))
    ) {
      const url = new URL("/unauthorised", request.url)
      return NextResponse.rewrite(url)
    }
  }

  return res
}

async function additionalAdminCheck(token: AuthToken): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000)
  const maxAgeSeconds = 8 * 60 * 60
  const tokenIsExpired = token.exp <= now
  const tokenIsTooOld = now - token.iat > maxAgeSeconds
  return !tokenIsExpired && !tokenIsTooOld
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
