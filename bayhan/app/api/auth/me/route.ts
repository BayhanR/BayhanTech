import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    // Şifre hariç kullanıcı bilgilerini döndür
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
          ? {
              category: user.profile.company.category,
              company: {
                name: user.profile.company.name,
                logo: user.profile.company.logoPath,
              },
            }
          : null,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

