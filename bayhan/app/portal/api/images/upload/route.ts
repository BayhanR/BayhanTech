import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || 'C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads'

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı doğrulama
    const user = await getCurrentUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'property' | 'product'
    const itemId = formData.get('itemId') as string

    if (!file || !type || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    // Dosya uzantısı
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Klasör yolu
    const folderPath = type === 'property' ? 'properties' : 'products'
    const itemFolder = join(UPLOAD_ROOT, folderPath, itemId)
    
    // Klasör yoksa oluştur
    if (!existsSync(itemFolder)) {
      await mkdir(itemFolder, { recursive: true })
    }

    // Dosya yolu
    const filePath = join(itemFolder, fileName)
    
    // Dosyayı buffer'a çevir ve kaydet
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Public URL (Next.js public klasörü üzerinden servis edilecek)
    const publicUrl = `/api/images/${folderPath}/${itemId}/${fileName}`

    // Veritabanına kaydet
    if (type === 'property') {
      await prisma.propertyImage.create({
        data: {
          propertyId: itemId,
          filePath: filePath,
          url: publicUrl,
        },
      })
    } else {
      await prisma.productImage.create({
        data: {
          productId: itemId,
          filePath: filePath,
          url: publicUrl,
        },
      })
    }

    return NextResponse.json({ url: publicUrl })
  } catch (error: unknown) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
