# 🏢 Brew Gayrimenkul - Resim Çekme Rehberi

## 📋 Genel Bilgi

**Site:** Brew Gayrimenkul  
**Category:** `brew`  
**Veri Tipi:** Properties (Emlak İlanları)  
**API Base URL:** `https://bayhan.tech`

---

## 🏗️ Property Sistemi

Brew Gayrimenkul, **emlak ilanları** (properties) kullanır. Her property şu bilgileri içerir:

- **Status:** `completed` (Biten) veya `ongoing` (Devam Eden)
- **Year:** Tamamlanma yılı (sadece biten inşaatlar için)
- **Progress:** Tamamlanma yüzdesi 0-100 (sadece devam eden inşaatlar için)
- **City:** İl (örn: İzmir, İstanbul)
- **District:** İlçe (örn: Konak, Kadıköy)
- **Images:** Fotoğraflar

---

## 📸 Resim Çekme Yöntemleri

### Yöntem 1: Tekil Resim URL'i (Önerilen)

Bir property'nin belirli bir resmini çekmek için:

```typescript
// lib/bayhan-images.ts
const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'

export function getBrewPropertyImageUrl(
  propertyId: string,
  fileName: string
): string {
  return `${BAYHAN_API_URL}/api/images/properties/${propertyId}/${fileName}`
}
```

**Kullanım:**
```tsx
import Image from 'next/image'
import { getBrewPropertyImageUrl } from '@/lib/bayhan-images'

// Property ID ve dosya adını bilmeniz gerekiyor
const imageUrl = getBrewPropertyImageUrl('property-uuid', '1234567890-abc123.jpg')

<Image
  src={imageUrl}
  alt="Brew Property"
  width={800}
  height={600}
/>
```

---

### Yöntem 2: Property'nin Tüm Resimlerini Çek

Bir property'nin tüm resimlerini listelemek için:

```typescript
// lib/bayhan-images.ts

export async function getBrewPropertyImages(
  propertyId: string
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
      `${BAYHAN_API_URL}/api/images/public/properties/${propertyId}`,
      { headers }
    )
    
    if (!response.ok) {
      console.error(`Brew API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.images || []
  } catch (error) {
    console.error('Brew property images fetch error:', error)
    return []
  }
}
```

**Kullanım:**
```tsx
'use client'

import { useEffect, useState } from 'react'
import { getBrewPropertyImages } from '@/lib/bayhan-images'
import Image from 'next/image'

export function BrewPropertyGallery({ propertyId }: { propertyId: string }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await getBrewPropertyImages(propertyId)
      setImages(imageUrls)
      setLoading(false)
    }
    fetchImages()
  }, [propertyId])

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`Property ${index + 1}`}
          width={400}
          height={300}
          className="object-cover rounded"
        />
      ))}
    </div>
  )
}
```

---

### Yöntem 3: Property Listesi ve Resimleri

Tüm property'leri ve resimlerini çekmek için:

```typescript
// lib/bayhan-properties.ts

const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'

export interface BrewProperty {
  id: string
  title: string
  description: string
  status: 'completed' | 'ongoing' | null
  year: number | null
  progress: number | null
  city: string | null
  district: string | null
  images: string[]
}

export async function getBrewProperties(): Promise<BrewProperty[]> {
  try {
    // Not: Bu endpoint şu an yok, eklenebilir
    // Şimdilik property'leri başka bir yöntemle çekmeniz gerekebilir
    
    // Örnek: Veritabanından direkt çekme (eğer aynı veritabanını kullanıyorsanız)
    // VEYA yeni bir public API endpoint'i eklenebilir
    
    return []
  } catch (error) {
    console.error('Brew properties fetch error:', error)
    return []
  }
}
```

---

## 🔗 API Endpoint'leri

### 1. Resim Servis Etme
```
GET /api/images/properties/{propertyId}/{fileName}
```

**Örnek:**
```
GET https://bayhan.tech/api/images/properties/abc-123-def/1234567890-xyz.jpg
```

**Response:** Image file (binary)

---

### 2. Resim Listesi (Public)
```
GET /api/images/public/properties/{propertyId}
```

**Headers (Opsiyonel):**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "images": [
    "/api/images/properties/abc-123-def/1234567890-xyz.jpg",
    "/api/images/properties/abc-123-def/1234567891-abc.jpg"
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
ALLOWED_ORIGIN="https://your-brew-site.com"
```

---

## 📝 Örnek: Tam Entegrasyon

```tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getBrewPropertyImages } from '@/lib/bayhan-images'

interface Property {
  id: string
  title: string
  city: string | null
  district: string | null
  status: string | null
  year: number | null
  progress: number | null
}

export function BrewPropertyCard({ property }: { property: Property }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await getBrewPropertyImages(property.id)
      setImages(imageUrls)
      setLoading(false)
    }
    fetchImages()
  }, [property.id])

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-xl font-bold">{property.title}</h3>
      <p className="text-gray-600">
        {property.city} / {property.district}
      </p>
      {property.status === 'ongoing' && property.progress && (
        <p className="text-blue-600">%{property.progress} Tamamlandı</p>
      )}
      {property.status === 'completed' && property.year && (
        <p className="text-green-600">{property.year} Yılında Tamamlandı</p>
      )}
      
      {loading ? (
        <div>Resimler yükleniyor...</div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {images.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`${property.title} - ${index + 1}`}
              width={300}
              height={200}
              className="object-cover rounded"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-4">Resim bulunamadı</p>
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
- Property ID doğru mu kontrol et
- Dosya adı doğru mu kontrol et

---

## 📞 Destek

Sorun yaşarsanız, BayhanTech projesindeki `RESIM_PAYLASIM_REHBERI.md` dosyasına bakın.

