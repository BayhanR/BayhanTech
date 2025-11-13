import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from './auth'
import { prisma } from './prisma'

export async function updateSession(request: NextRequest) {
  // Token'ı al
  const token = getTokenFromRequest(request)

  // Token yoksa ve dashboard sayfasındaysa login'e yönlendir
  if (!token && request.nextUrl.pathname.startsWith('/portal/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal'
    return NextResponse.redirect(url)
  }

  // Token varsa doğrula
  if (token) {
    const payload = verifyToken(token)
    if (!payload) {
      // Geçersiz token, cookie'yi sil ve login'e yönlendir
      const response = NextResponse.redirect(new URL('/portal', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!user || !user.profile) {
      // Kullanıcı veya profil yok, login'e yönlendir
      const response = NextResponse.redirect(new URL('/portal', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}
