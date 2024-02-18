import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const requireAuth: string[] = ["/chat", "/api", "/reporting", "/unauthorized"];
const requireAdmin: string[] = ["/reporting"];

export async function middleware(request: NextRequest) {
    // Development environment request logging
    if (process.env.NODE_ENV === 'development') {
        const { method, url } = request;
        const ip = request.headers.get('x-forwarded-for') || 'IP not available';
        console.log(`[${new Date().toISOString()}] - ${method} Request to ${url} from ${ip}`);
    }

    const res = NextResponse.next();
    const pathname = request.nextUrl.pathname;

    if (requireAuth.some((path) => pathname.startsWith(path))) {
        const token = await getToken({ req: request });

        // Check not logged in
        if (!token) {
            const url = new URL(`/`, request.url);
            return NextResponse.redirect(url);
        }

        // Check if not authorized for admin paths
        if (requireAdmin.some((path) => pathname.startsWith(path)) && !token.isAdmin) {
            const url = new URL(`/unauthorized`, request.url);
            return NextResponse.rewrite(url);
        }
    }

    return res;
}

// Note that middleware is not applied to api/auth as this is required to logon (i.e., requires anon access)
export const config = { matcher: ["/chat/:path*", "/reporting/:path*", "/api/chat/:path*"] };
