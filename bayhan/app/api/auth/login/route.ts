import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.' },
        { status: 401 }
      )
    }

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.' },
        { status: 401 }
      )
    }

    // Profile kontrolü
    if (!user.profile) {
      return NextResponse.json(
        { error: 'Kullanıcı profili bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.' },
        { status: 403 }
      )
    }

    // JWT token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    // Response oluştur
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        profile: {
          category: user.profile.company.category,
          company: {
            name: user.profile.company.name,
            logo: user.profile.company.logoPath,
          },
        },
      },
    })

    // Cookie'ye token yaz (response'a ekle)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

