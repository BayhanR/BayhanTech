# 📸 Resim Paylaşım Rehberi - Çoklu Proje Entegrasyonu

## 🎯 Genel Bakış

Bu proje (BayhanTech) ve diğer projeleriniz (örneğin Perdi projesi) aynı resimleri paylaşabilir. Bu rehber, resimlerin nasıl organize edildiğini ve diğer projelerle nasıl paylaşılacağını açıklar.

---

## 📚 Site-Specific Dökümanlar

Her site için ayrı detaylı dökümanlar hazırlandı:

1. **🏢 Brew Gayrimenkul** → `doc/BREW_GAYRIMENKUL_RESIM_CEKME.md`
   - Properties (Emlak İlanları) sistemi
   - Status, Year, Progress, City, District alanları
   - Resim çekme örnekleri

2. **🪟 Tezerperde.com** → `doc/TEZERPERDE_RESIM_CEKME.md`
   - Products (Perde Ürünleri) sistemi
   - Resim çekme örnekleri

3. **👗 Mina Giyim** → `doc/MINA_GIYIM_RESIM_CEKME.md`
   - Products (Giyim Ürünleri) sistemi
   - Resim çekme örnekleri

4. **✅ Property Sistemi Özet** → `doc/PROPERTY_SISTEMI_ODET.md`
   - Brew Gayrimenkul property sistemi kontrol listesi
   - Tüm özellikler ve kullanım örnekleri

---

## 📁 Mevcut Resim Yapısı

### Klasör Yapısı

```
C:\inetpub\wwwroot\BayhanTech\bayhan\uploads\
├── products\
│   └── {productId}\
│       ├── 1234567890-abc123.jpg
│       ├── 1234567891-def456.jpg
│       └── ...
└── properties\
    └── {propertyId}\
        ├── 1234567890-xyz789.jpg
        └── ...
```

### Resim Organizasyonu

- **Her ürün/emlak için ayrı klasör**: Her `productId` veya `propertyId` için ayrı klasör oluşturulur
- **Benzersiz dosya isimleri**: `{timestamp}-{random}.{ext}` formatında
- **Veritabanı kaydı**: Her resim `property_images` veya `product_images` tablosunda kayıtlı

### URL Yapısı

```
https://bayhan.tech/api/images/products/{productId}/{fileName}
https://bayhan.tech/api/images/properties/{propertyId}/{fileName}
```

---

## 🔄 Çözüm Seçenekleri

### ✅ ÖNERİLEN: Seçenek 1 - Ortak Klasör + API Paylaşımı

**Avantajlar:**
- ✅ Tek bir kaynak (single source of truth)
- ✅ Kolay yönetim
- ✅ Her iki proje de aynı resimleri görür
- ✅ Güncellemeler otomatik yansır

**Nasıl Çalışır:**
1. Her iki proje de aynı `UPLOAD_ROOT` klasörünü kullanır
2. Diğer proje, bu projenin API endpoint'ini kullanarak resimleri çeker
3. Upload işlemi sadece bu projeden yapılır

---

### Seçenek 2 - Symlink ile Paylaşım

**Avantajlar:**
- ✅ Her proje kendi klasör yapısını korur
- ✅ Bağımsız yönetim

**Dezavantajlar:**
- ❌ Windows'ta symlink kurulumu gerekir
- ❌ Daha karmaşık yapı

---

### Seçenek 3 - Ortak Servis (Gelişmiş)

**Avantajlar:**
- ✅ Merkezi yönetim
- ✅ Ölçeklenebilir

**Dezavantajlar:**
- ❌ Daha fazla kurulum gerektirir
- ❌ Overkill (küçük projeler için)

---

## 🚀 Uygulama: Seçenek 1 (Önerilen)

### Adım 1: Ortak Klasör Yapısı

Her iki proje de aynı klasörü kullanmalı:

**BayhanTech projesi (.env):**
```env
UPLOAD_ROOT="C:\inetpub\wwwroot\BayhanTech\bayhan\uploads"
```

**Perdi projesi (.env):**
```env
UPLOAD_ROOT="C:\inetpub\wwwroot\BayhanTech\bayhan\uploads"
# VEYA
BAYHAN_API_URL="https://bayhan.tech"
```

---

### Adım 2: Diğer Projede API Entegrasyonu

Perdi projesinde resimleri çekmek için:

#### 2.1. Resim Çekme Fonksiyonu

```typescript
// lib/bayhan-images.ts

const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'
const BAYHAN_API_TOKEN = process.env.BAYHAN_API_TOKEN // Opsiyonel

/**
 * BayhanTech'den resim URL'i al
 */
export function getBayhanImageUrl(
  type: 'product' | 'property',
  itemId: string,
  fileName: string
): string {
  return `${BAYHAN_API_URL}/api/images/${type}s/${itemId}/${fileName}`
}

/**
 * BayhanTech API'den resim listesi çek
 * 
 * Endpoint: GET /api/images/public/{type}/{itemId}
 */
export async function getBayhanImages(
  type: 'product' | 'property',
  itemId: string
): Promise<string[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Token varsa ekle
    if (BAYHAN_API_TOKEN) {
      headers['Authorization'] = `Bearer ${BAYHAN_API_TOKEN}`
    }
    
    const response = await fetch(
      `${BAYHAN_API_URL}/api/images/public/${type}s/${itemId}`,
      { headers }
    )
    
    if (!response.ok) {
      console.error(`Bayhan API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.images || []
  } catch (error) {
    console.error('Bayhan image fetch error:', error)
    return []
  }
}
```

#### 2.2. React Component'te Kullanım

```typescript
// components/ProductImage.tsx

import { getBayhanImageUrl } from '@/lib/bayhan-images'

interface ProductImageProps {
  productId: string
  fileName: string
  alt?: string
}

export function ProductImage({ productId, fileName, alt }: ProductImageProps) {
  const imageUrl = getBayhanImageUrl('product', productId, fileName)
  
  return (
    <img
      src={imageUrl}
      alt={alt || 'Product image'}
      loading="lazy"
      className="w-full h-auto"
    />
  )
}
```

#### 2.3. Next.js Image Component ile

```typescript
import Image from 'next/image'
import { getBayhanImageUrl } from '@/lib/bayhan-images'

export function ProductImage({ productId, fileName }: Props) {
  const imageUrl = getBayhanImageUrl('product', productId, fileName)
  
  return (
    <Image
      src={imageUrl}
      alt="Product"
      width={800}
      height={600}
      className="object-cover"
    />
  )
}
```

**Not:** `next.config.ts`'de external domain ekle:

```typescript
// next.config.ts
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

### Adım 3: Resim Listesi Endpoint'i (✅ Eklendi)

Public resim listesi endpoint'i eklendi:

**Endpoint:** `GET /api/images/public/{type}/{itemId}`

**Örnek:**
- `GET /api/images/public/products/{productId}`
- `GET /api/images/public/properties/{propertyId}`

**Response:**
```json
{
  "images": [
    "/api/images/products/xxx/1234567890-abc123.jpg",
    "/api/images/products/xxx/1234567891-def456.jpg"
  ],
  "count": 2
}
```

**Güvenlik:**
- `.env` dosyasında `IMAGE_API_TOKEN` varsa, token kontrolü yapılır
- Token yoksa public erişim (sadece okuma)

---

## 🔐 Güvenlik Önerileri

### 1. CORS Ayarları (✅ Eklendi)

CORS desteği eklendi. `.env` dosyasında `ALLOWED_ORIGIN` ayarla:

```env
# Tüm origin'lere izin ver (development)
ALLOWED_ORIGIN="*"

# VEYA belirli origin'lere izin ver (production)
ALLOWED_ORIGIN="https://perdi.com,https://www.perdi.com"
```

**Not:** CORS header'ları otomatik olarak ekleniyor.

### 2. API Token (✅ Eklendi)

Public resim listesi endpoint'i için token kontrolü eklendi:

```env
# .env dosyasına ekle (opsiyonel)
IMAGE_API_TOKEN="güçlü-bir-token-buraya"
```

**Kullanım:**
```typescript
// Token ile istek
fetch('https://bayhan.tech/api/images/public/products/xxx', {
  headers: {
    'Authorization': 'Bearer güçlü-bir-token-buraya'
  }
})
```

**Not:** Token yoksa public erişim mümkün (sadece okuma).

---

## 📋 Hızlı Başlangıç Checklist

### BayhanTech Projesi (Bu Proje) ✅

- [x] `UPLOAD_ROOT` environment variable ayarlı
- [x] Upload endpoint'leri çalışıyor
- [x] Image serving endpoint'i çalışıyor (`/api/images/[...path]`)
- [x] Public resim listesi endpoint'i eklendi (`/api/images/public/...`)
- [x] CORS desteği eklendi
- [x] Token desteği eklendi (opsiyonel)

### Diğer Proje (Perdi)

- [ ] `.env` dosyasına `BAYHAN_API_URL` eklendi
- [ ] `lib/bayhan-images.ts` oluşturuldu
- [ ] `next.config.ts`'de external domain eklendi
- [ ] Component'lerde resim URL'leri kullanılıyor

---

## 🧪 Test Etme

### 1. Resim Yükleme Testi

```bash
# BayhanTech'den resim yükle
curl -X POST https://bayhan.tech/portal/api/images/upload \
  -H "Cookie: next-auth.session-token=..." \
  -F "file=@test.jpg" \
  -F "type=product" \
  -F "itemId=xxx"
```

### 2. Resim Çekme Testi

```bash
# Diğer projeden resim çek
curl https://bayhan.tech/api/images/products/{productId}/{fileName}
```

### 3. Browser'da Test

```html
<!-- Diğer projede -->
<img src="https://bayhan.tech/api/images/products/xxx/1234567890-abc123.jpg" />
```

---

## ❓ Sık Sorulan Sorular

### Q: Her projenin kendi klasörü var mı?

**A:** Hayır. Şu anki yapıda her **item** (product/property) için ayrı klasör var, proje bazlı değil. Tüm projeler aynı klasörü paylaşır.

### Q: Proje bazlı ayrım istersem ne yapmalıyım?

**A:** Klasör yapısını şöyle değiştirebilirsin:

```
uploads/
├── bayhan/
│   ├── products/
│   └── properties/
└── perdi/
    ├── products/
    └── properties/
```

Sonra upload kodunda:

```typescript
const projectFolder = process.env.PROJECT_NAME || 'bayhan'
const itemFolder = join(UPLOAD_ROOT, projectFolder, folderPath, itemId)
```

### Q: Resimleri nasıl senkronize ederim?

**A:** Ortak klasör kullandığın için otomatik senkronize. Bir projeden yüklenen resim, diğer projede de görünür.

### Q: Performans sorunu olur mu?

**A:** Hayır. Resimler statik dosya olarak servis ediliyor ve cache'leniyor. Her iki proje de aynı dosyaları okur.

---

## 🔧 Sorun Giderme

### Problem: Resimler görünmüyor

**Çözüm:**
1. `UPLOAD_ROOT` path'ini kontrol et
2. Dosya izinlerini kontrol et (Windows'ta klasör erişim izinleri)
3. API endpoint'inin çalıştığını kontrol et

### Problem: CORS hatası

**Çözüm:**
- `app/api/images/[...path]/route.ts`'de CORS header'ları ekle

### Problem: Next.js Image component hatası

**Çözüm:**
- `next.config.ts`'de `remotePatterns` ekle

---

## 📝 Özet

1. **Ortak klasör kullan**: Her iki proje de aynı `UPLOAD_ROOT` klasörünü kullanır
2. **API endpoint paylaş**: Diğer proje, bu projenin `/api/images/[...path]` endpoint'ini kullanır
3. **URL yapısı**: `https://bayhan.tech/api/images/{type}/{itemId}/{fileName}`
4. **Otomatik senkronizasyon**: Bir projeden yüklenen resim, diğer projede de görünür

---

## 🎯 Sonraki Adımlar

1. Diğer projeye `BAYHAN_API_URL` ekle
2. Resim çekme fonksiyonlarını ekle
3. Component'lerde kullan
4. Test et!

