import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || 'C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads'

// CORS headers helper
function getCorsHeaders() {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  })
}

// Public GET endpoint - Tüm product'ları listele
export async function GET(request: NextRequest) {
  try {
    // Optional token verification
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (process.env.IMAGE_API_TOKEN && token !== process.env.IMAGE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getCorsHeaders() }
      )
    }

    // Query parametrelerini al
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // "perdeci", "mina", vb.

    // Filtreleme: category varsa sadece o category'ye ait product'ları getir
    const whereClause: any = {}
    
    if (category) {
      // User'ın profile'ındaki company category'sine göre filtrele
      whereClause.user = {
        profile: {
          company: {
            category: category,
          },
        },
      }
    }

    // Tüm product'ları çek (resimlerle birlikte)
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          include: {
            profile: {
              include: {
                company: {
                  select: {
                    category: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Base URL'i al
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_PATH || 'https://bayhan.tech'
    const cleanBaseUrl = baseUrl.replace(/\/$/, '') // Trailing slash'i kaldır

    // Response formatı: her product için resim URL'lerini ekle (tam URL)
    const productsWithImages = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt,
      category: product.user?.profile?.company?.category || null, // Category bilgisini ekle
      images: product.images.map((img) => {
        // Eğer URL zaten tam URL ise olduğu gibi döndür, değilse base URL ekle
        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          return img.url
        }
        return `${cleanBaseUrl}${img.url}`
      }),
    }))

    return NextResponse.json(
      { products: productsWithImages, count: products.length },
      { headers: getCorsHeaders() }
    )
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

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

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'En az bir fotoğraf gereklidir' }, { status: 400 })
    }

    const createdProducts: any[] = []

    // Her fotoğraf için ayrı product oluştur
    for (const file of files) {
      const productName = `Perde ${new Date().toLocaleDateString('tr-TR')} - ${Date.now()}`
      
      const product = await prisma.product.create({
        data: {
          userId: user.id,
          name: productName,
          description: 'Perde ürünü',
        },
      })

      // Fotoğrafı yükle
      const itemFolder = join(UPLOAD_ROOT, 'products', product.id)
      if (!existsSync(itemFolder)) {
        await mkdir(itemFolder, { recursive: true })
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = join(itemFolder, fileName)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      const publicUrl = `/api/images/products/${product.id}/${fileName}`

      await prisma.productImage.create({
        data: {
          productId: product.id,
          filePath: filePath,
          url: publicUrl,
        },
      })

      createdProducts.push({ ...product, imageUrl: publicUrl })
    }

    return NextResponse.json({ products: createdProducts })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create products' }, { status: 500 })
  }
}
