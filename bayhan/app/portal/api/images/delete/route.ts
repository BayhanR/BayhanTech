import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || 'C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads'

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı doğrulama
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

    const { imageUrl, type } = await request.json()

    if (!imageUrl || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // URL'den path'i çıkar: /api/images/properties/itemId/fileName
    const urlParts = imageUrl.split('/')
    const apiIndex = urlParts.indexOf('api')
    if (apiIndex === -1 || urlParts[apiIndex + 1] !== 'images') {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }

    const folder = urlParts[apiIndex + 2] // 'properties' veya 'products'
    const itemId = urlParts[apiIndex + 3]
    const fileName = urlParts[apiIndex + 4]

    if (folder !== 'properties' && folder !== 'products') {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    // Kullanıcının bu item'a erişim yetkisi var mı kontrol et
    if (type === 'property') {
      const property = await prisma.property.findFirst({
        where: {
          id: itemId,
          userId: user.id,
        },
      })
      if (!property) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else {
      const product = await prisma.product.findFirst({
        where: {
          id: itemId,
          userId: user.id,
        },
      })
      if (!product) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    // Veritabanından sil
    if (type === 'property') {
      const image = await prisma.propertyImage.findFirst({
        where: {
          url: imageUrl,
          property: {
            userId: user.id,
          },
        },
      })

      if (image) {
        await prisma.propertyImage.delete({
          where: { id: image.id },
        })

        // Dosyayı sil
        const filePath = join(UPLOAD_ROOT, folder, itemId, fileName)
        if (existsSync(filePath)) {
          await unlink(filePath)
        }
      }
    } else {
      const image = await prisma.productImage.findFirst({
        where: {
          url: imageUrl,
          product: {
            userId: user.id,
          },
        },
      })

      if (image) {
        await prisma.productImage.delete({
          where: { id: image.id },
        })

        // Dosyayı sil
        const filePath = join(UPLOAD_ROOT, folder, itemId, fileName)
        if (existsSync(filePath)) {
          await unlink(filePath)
        }
      }
    }

    return NextResponse.json({ deleted: true })
  } catch (error: unknown) {
    console.error('Delete error:', error)
    const message = error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
