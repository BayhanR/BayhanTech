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

// Public GET endpoint - Tüm property'leri listele
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

    // Tüm property'leri çek (resimlerle birlikte)
    const properties = await prisma.property.findMany({
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Base URL'i al
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_PATH || 'https://bayhan.tech'
    const cleanBaseUrl = baseUrl.replace(/\/$/, '') // Trailing slash'i kaldır

    // Response formatı: her property için resim URL'lerini ekle (tam URL)
    const propertiesWithImages = properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      status: property.status,
      year: property.year,
      progress: property.progress,
      city: property.city,
      district: property.district,
      createdAt: property.createdAt,
      images: property.images.map((img) => {
        // Eğer URL zaten tam URL ise olduğu gibi döndür, değilse base URL ekle
        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          return img.url
        }
        return `${cleanBaseUrl}${img.url}`
      }),
    }))

    return NextResponse.json(
      { properties: propertiesWithImages, count: properties.length },
      { headers: getCorsHeaders() }
    )
  } catch (error) {
    console.error('Properties fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
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
    const status = formData.get('status') as string
    const year = formData.get('year') ? parseInt(formData.get('year') as string) : null
    const progress = formData.get('progress') ? parseInt(formData.get('progress') as string) : null
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const files = formData.getAll('files') as File[]

    if (!city || !district) {
      return NextResponse.json({ error: 'İl ve ilçe gereklidir' }, { status: 400 })
    }

    if (status === 'completed' && !year) {
      return NextResponse.json({ error: 'Biten inşaat için yıl gereklidir' }, { status: 400 })
    }

    if (status === 'ongoing' && !progress) {
      return NextResponse.json({ error: 'Devam eden inşaat için ilerleme yüzdesi gereklidir' }, { status: 400 })
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'En az bir fotoğraf gereklidir' }, { status: 400 })
    }

    // Property oluştur
    const title = status === 'completed'
      ? `${year} - ${city} / ${district} - Biten İnşaat`
      : `%${progress} - ${city} / ${district} - Devam Eden İnşaat`

    const description = status === 'completed'
      ? `${year} yılında tamamlanan inşaat projesi - ${city} / ${district}`
      : `%${progress} tamamlanmış inşaat projesi - ${city} / ${district}`

    const property = await prisma.property.create({
      data: {
        userId: user.id,
        title,
        description,
        status: status as 'completed' | 'ongoing',
        year,
        progress,
        city,
        district,
      },
    })

    // Fotoğrafları yükle
    const itemFolder = join(UPLOAD_ROOT, 'properties', property.id)
    if (!existsSync(itemFolder)) {
      await mkdir(itemFolder, { recursive: true })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = join(itemFolder, fileName)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      const publicUrl = `/api/images/properties/${property.id}/${fileName}`

      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          filePath: filePath,
          url: publicUrl,
        },
      })

      uploadedUrls.push(publicUrl)
    }

    return NextResponse.json({ property, images: uploadedUrls })
  } catch (error) {
    console.error('Property creation error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
