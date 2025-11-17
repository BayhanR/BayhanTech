# 👗 Mina Giyim - Resim Çekme Rehberi

## 📋 Genel Bilgi

**Site:** Mina Giyim  
**Category:** `mina`  
**Veri Tipi:** Products (Giyim Ürünleri)  
**API Base URL:** `https://bayhan.tech`

---

## 🛍️ Product Sistemi

Mina Giyim, **giyim ürünleri** (products) kullanır. Her product şu bilgileri içerir:

- **Name:** Ürün adı
- **Description:** Ürün açıklaması
- **Images:** Fotoğraflar (her ürün için en az 1 fotoğraf)

**Not:** Mina Giyim'de her fotoğraf için otomatik olarak ayrı bir product oluşturulabilir (Tezerperde gibi).

---

## 📸 Resim Çekme Yöntemleri

### Yöntem 1: Tekil Resim URL'i (Önerilen)

Bir product'un belirli bir resmini çekmek için:

```typescript
// lib/bayhan-images.ts
const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'

export function getMinaProductImageUrl(
  productId: string,
  fileName: string
): string {
  return `${BAYHAN_API_URL}/api/images/products/${productId}/${fileName}`
}
```

**Kullanım:**
```tsx
import Image from 'next/image'
import { getMinaProductImageUrl } from '@/lib/bayhan-images'

// Product ID ve dosya adını bilmeniz gerekiyor
const imageUrl = getMinaProductImageUrl('product-uuid', '1234567890-abc123.jpg')

<Image
  src={imageUrl}
  alt="Mina Giyim Product"
  width={800}
  height={600}
/>
```

---

### Yöntem 2: Product'un Tüm Resimlerini Çek

Bir product'un tüm resimlerini listelemek için:

```typescript
// lib/bayhan-images.ts

export async function getMinaProductImages(
  productId: string
): Promise<string[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Token varsa ekle (opsiyonel)
    if (process.env.BAYHAN_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.BAYHAN_API_TOKEN}`
    }
    
    const response = await fetch(
      `${BAYHAN_API_URL}/api/images/public/products/${productId}`,
      { headers }
    )
    
    if (!response.ok) {
      console.error(`Mina API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.images || []
  } catch (error) {
    console.error('Mina product images fetch error:', error)
    return []
  }
}
```

**Kullanım:**
```tsx
'use client'

import { useEffect, useState } from 'react'
import { getMinaProductImages } from '@/lib/bayhan-images'
import Image from 'next/image'

export function MinaProductCard({ productId }: { productId: string }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await getMinaProductImages(productId)
      setImages(imageUrls)
      setLoading(false)
    }
    fetchImages()
  }, [productId])

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="grid grid-cols-1 gap-4">
      {images.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`Giyim Ürünü ${index + 1}`}
          width={600}
          height={800}
          className="object-cover rounded"
        />
      ))}
    </div>
  )
}
```

---

### Yöntem 3: Tüm Product'ları ve Resimlerini Çek

Tüm product'ları ve resimlerini çekmek için:

```typescript
// lib/bayhan-products.ts

const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'

export interface MinaProduct {
  id: string
  name: string
  description: string | null
  images: string[]
}

export async function getMinaProducts(): Promise<MinaProduct[]> {
  try {
    // Not: Bu endpoint şu an yok, eklenebilir
    // Şimdilik product'ları başka bir yöntemle çekmeniz gerekebilir
    
    // Örnek: Veritabanından direkt çekme (eğer aynı veritabanını kullanıyorsanız)
    // VEYA yeni bir public API endpoint'i eklenebilir
    
    return []
  } catch (error) {
    console.error('Mina products fetch error:', error)
    return []
  }
}
```

---

## 🔗 API Endpoint'leri

### 1. Resim Servis Etme
```
GET /api/images/products/{productId}/{fileName}
```

**Örnek:**
```
GET https://bayhan.tech/api/images/products/abc-123-def/1234567890-xyz.jpg
```

**Response:** Image file (binary)

---

### 2. Resim Listesi (Public)
```
GET /api/images/public/products/{productId}
```

**Headers (Opsiyonel):**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "images": [
    "/api/images/products/abc-123-def/1234567890-xyz.jpg",
    "/api/images/products/abc-123-def/1234567891-abc.jpg"
  ],
  "count": 2
}
```

---

## ⚙️ Next.js Konfigürasyonu

`next.config.ts` dosyasına ekle:

```typescript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bayhan.tech',
        pathname: '/api/images/**',
      },
    ],
  },
}
```

---

## 🔐 Güvenlik

### Environment Variables

`.env.local` dosyasına ekle:

```env
BAYHAN_API_URL="https://bayhan.tech"
BAYHAN_API_TOKEN="your-token-here" # Opsiyonel
```

### CORS

Eğer farklı bir domain'den erişiyorsanız, BayhanTech projesinde `.env` dosyasına:

```env
ALLOWED_ORIGIN="https://minagiyim.com"
```

---

## 📝 Örnek: Tam Entegrasyon

```tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getMinaProductImages } from '@/lib/bayhan-images'

interface Product {
  id: string
  name: string
  description: string | null
}

export function MinaProductGallery({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await getMinaProductImages(product.id)
      setImages(imageUrls)
      setLoading(false)
    }
    fetchImages()
  }, [product.id])

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <h3 className="p-4 font-semibold text-center">{product.name}</h3>
      {loading ? (
        <div className="h-96 bg-gray-200 animate-pulse" />
      ) : images.length > 0 ? (
        <div className="relative">
          <Image
            src={images[0]}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-auto object-cover"
          />
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              +{images.length - 1}
            </div>
          )}
        </div>
      ) : (
        <div className="h-96 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">Resim bulunamadı</p>
        </div>
      )}
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] `.env.local` dosyasına `BAYHAN_API_URL` eklendi
- [ ] `next.config.ts`'de external domain eklendi
- [ ] `lib/bayhan-images.ts` oluşturuldu
- [ ] Component'lerde resim URL'leri kullanılıyor
- [ ] CORS ayarları yapıldı (gerekirse)

---

## 🆘 Sorun Giderme

### Resimler görünmüyor
- `BAYHAN_API_URL` doğru mu kontrol et
- `next.config.ts`'de `remotePatterns` eklendi mi kontrol et
- Browser console'da CORS hatası var mı kontrol et

### 401 Unauthorized
- Token gerekli mi kontrol et
- Token doğru mu kontrol et

### 404 Not Found
- Product ID doğru mu kontrol et
- Dosya adı doğru mu kontrol et

---

## 📞 Destek

Sorun yaşarsanız, BayhanTech projesindeki `RESIM_PAYLASIM_REHBERI.md` dosyasına bakın.

