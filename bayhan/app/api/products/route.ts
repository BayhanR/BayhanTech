import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || 'C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request)
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
