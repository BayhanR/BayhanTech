import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Konu ve mesaj gereklidir' }, { status: 400 })
    }

    // Support ticket oluştur
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        message,
        status: 'open',
      },
    })

    // Email gönder (mevcut /api/contact endpoint'ini kullan)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.email,
          email: user.email,
          message: `[DESTEK TİCKET - Portal]\n\nKonu: ${subject}\n\nMesaj:\n${message}`,
          services: ['Portal Destek'],
        }),
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Email hatası ticket oluşturmayı engellemez
    }

    return NextResponse.json({ ticket, success: true })
  } catch (error) {
    console.error('Support ticket creation error:', error)
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 })
  }
}

