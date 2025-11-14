import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isOnDashboard = nextUrl.pathname.startsWith("/portal/dashboard")

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/portal", nextUrl))
  }

  if (isLoggedIn && nextUrl.pathname === "/portal") {
    return NextResponse.redirect(new URL("/portal/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/portal/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

