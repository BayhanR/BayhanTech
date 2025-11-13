import { NextResponse } from 'next/server'
import { deleteTokenCookie } from '@/lib/auth'

export async function POST() {
  try {
    await deleteTokenCookie()
    return NextResponse.json({ message: 'Çıkış yapıldı' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

