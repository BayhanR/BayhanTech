import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId required' }, { status: 400 })
    }

    // Kullanıcının bu property'ye erişim yetkisi var mı kontrol et
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId: user.id,
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(images.map(img => img.url))
  } catch (error) {
    console.error('Property images fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

