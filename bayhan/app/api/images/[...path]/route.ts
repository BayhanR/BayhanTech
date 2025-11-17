import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || 'C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Path: ['properties', 'itemId', 'fileName'] veya ['products', 'itemId', 'fileName']
    const { path: pathParts } = await params
    if (pathParts.length < 3) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const [folder, itemId, fileName] = pathParts
    if (folder !== 'properties' && folder !== 'products') {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    // Dosya yolu
    const filePath = join(UPLOAD_ROOT, folder, itemId, fileName)

    // Dosya var mı kontrol et
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Dosyayı oku
    const fileBuffer = await readFile(filePath)

    // Content-Type belirle
    const ext = fileName.split('.').pop()?.toLowerCase()
    const contentType = 
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
      ext === 'png' ? 'image/png' :
      ext === 'gif' ? 'image/gif' :
      ext === 'webp' ? 'image/webp' :
      'application/octet-stream'

    // CORS header'ları (diğer projelerden erişim için)
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
    
    // Dosyayı döndür
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: unknown) {
    console.error('Image serve error:', error)
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 })
  }
}

