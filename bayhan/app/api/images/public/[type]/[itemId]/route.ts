import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Public resim listesi endpoint'i
 * Diğer projelerden erişim için (opsiyonel token ile korunabilir)
 * 
 * Kullanım:
 * GET /api/images/public/products/{productId}
 * GET /api/images/public/properties/{propertyId}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; itemId: string }> }
) {
  try {
    const { type, itemId } = await params
    
    // Token kontrolü (opsiyonel - .env'de IMAGE_API_TOKEN varsa kontrol et)
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const requiredToken = process.env.IMAGE_API_TOKEN
    
    if (requiredToken && token !== requiredToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (type !== 'products' && type !== 'properties') {
      return NextResponse.json({ error: 'Invalid type. Use "products" or "properties"' }, { status: 400 })
    }
    
    let images: { url: string; createdAt: Date }[] = []
    
    if (type === 'products') {
      const productImages = await prisma.productImage.findMany({
        where: { productId: itemId },
        select: {
          url: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      })
      images = productImages
    } else {
      const propertyImages = await prisma.propertyImage.findMany({
        where: { propertyId: itemId },
        select: {
          url: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      })
      images = propertyImages
    }
    
    // CORS header'ları
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
    
    return NextResponse.json(
      { 
        images: images.map(img => img.url),
        count: images.length,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (error) {
    console.error('Public image list error:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

