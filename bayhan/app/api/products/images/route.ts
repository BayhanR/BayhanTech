import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    // Kullanıcının bu product'a erişim yetkisi var mı kontrol et
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: user.id,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(images.map(img => img.url))
  } catch (error) {
    console.error('Product images fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

