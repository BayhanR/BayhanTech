import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/middleware"

export async function middleware(request: NextRequest) {
  // Sadece portal route'ları için middleware'i çalıştır
  if (request.nextUrl.pathname.startsWith("/portal")) {
    return await updateSession(request)
  }
  
  // Diğer route'lar için middleware çalıştırma
  return
}

export const config = {
  matcher: [
    // Sadece portal route'ları
    "/portal/:path*",
  ],
}

