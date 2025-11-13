# Portal Sistemi - Tam Dökümantasyon

Bu dökümantasyon, Portal sisteminin tüm özelliklerini, kurulumunu, kullanımını ve API'lerini kapsamlı bir şekilde açıklar.

## 📋 İçindekiler

1. [Sistem Mimarisi](#sistem-mimarisi)
2. [Kurulum](#kurulum)
3. [Fotoğraf Yükleme Sistemi](#fotoğraf-yükleme-sistemi)
4. [Veritabanı Yapısı](#veritabanı-yapısı)
5. [Storage Yapısı](#storage-yapısı)
6. [API Kullanımı](#api-kullanımı)
7. [Frontend'den Veri Çekme](#frontendden-veri-çekme)
8. [Public API ile Veri Çekme](#public-api-ile-veri-çekme)
9. [Abonelik Yönetimi](#abonelik-yönetimi)
10. [Güvenlik](#güvenlik)

---

## 🏗️ Sistem Mimarisi

### Genel Yapı

```
Portal Sistemi
├── Frontend (Next.js)
│   ├── Dashboard Sayfaları
│   ├── Image Upload Components
│   └── Gallery Components
├── Backend (Supabase)
│   ├── Authentication
│   ├── Database (PostgreSQL)
│   └── Storage (Object Storage)
└── API Routes (Next.js)
    ├── /api/images/upload
    └── /api/images/delete
```

### Veri Akışı

1. **Fotoğraf Yükleme:**
   ```
   Kullanıcı → Frontend Component → Supabase Storage → Database (URL kaydı)
   ```

2. **Fotoğraf Çekme:**
   ```
   Frontend/API → Database (URL'leri al) → Supabase Storage (Public URL'ler)
   ```

---

## 🚀 Kurulum

### 1. Supabase Projesi Oluşturma

1. **Supabase'e gidin**: https://supabase.com
2. **Hesap oluşturun** (ücretsiz)
3. **"New Project"** butonuna tıklayın
4. Proje bilgilerini doldurun
5. Proje oluşturulmasını bekleyin (2-3 dakika)

### 2. API Keys'i Alma

1. Supabase dashboard'da sol menüden **"Settings"** (⚙️) seçin
2. **"API"** sekmesine gidin
3. Şu bilgileri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Environment Variables

`.env.local` dosyasını oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Önemli:** 
- Değerleri tırnak işareti olmadan yazın
- `NEXT_PUBLIC_` prefix'ini mutlaka kullanın

### 4. Veritabanı Tablolarını Oluşturma

Supabase Dashboard → **SQL Editor** → **New query**

Tüm SQL script'lerini `doc/SUPABASE_KURULUM.md` dosyasından kopyalayıp çalıştırın.

---

## 📸 Fotoğraf Yükleme Sistemi

### Nasıl Çalışır?

1. **Kullanıcı fotoğraf seçer** (Dashboard'dan)
2. **Frontend component** fotoğrafı Supabase Storage'a yükler
3. **Public URL** oluşturulur
4. **URL veritabanına kaydedilir** (`product_images` veya `property_images` tablosuna)

### Storage Bucket Yapısı

#### 1. `property-images` Bucket
- **Amaç:** Emlak (property) fotoğrafları
- **Yapı:** `{propertyId}/{timestamp}-{random}.{ext}`
- **Örnek:** `abc123/1704067200000-0.123.jpg`

#### 2. `product-images` Bucket
- **Amaç:** Ürün (product) fotoğrafları
- **Yapı:** `{productId}/{timestamp}-{random}.{ext}`
- **Örnek:** `xyz789/1704067200000-0.456.png`

### Fotoğraf Yükleme Süreci

#### Adım 1: Storage Bucket Oluşturma

Supabase Dashboard → **Storage** → **Create a new bucket**

**property-images bucket:**
- Name: `property-images`
- Public bucket: ✅ (işaretleyin)

**product-images bucket:**
- Name: `product-images`
- Public bucket: ✅ (işaretleyin)

#### Adım 2: Storage Policies (Güvenlik)

Her bucket için policy ekleyin:

**property-images için:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images'::text);
```

**product-images için:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images'::text);
```

#### Adım 3: Fotoğraf Yükleme (Kod Örneği)

```typescript
// 1. Supabase client oluştur
const supabase = createClient()

// 2. Dosya adını oluştur
const fileExt = file.name.split(".").pop()
const fileName = `${itemId}/${Date.now()}-${Math.random()}.${fileExt}`

// 3. Storage'a yükle
const { error: uploadError } = await supabase
  .storage
  .from("property-images") // veya "product-images"
  .upload(fileName, file)

if (uploadError) throw uploadError

// 4. Public URL al
const { data } = supabase
  .storage
  .from("property-images")
  .getPublicUrl(fileName)

const imageUrl = data.publicUrl

// 5. Veritabanına kaydet
await supabase
  .from("property_images") // veya "product_images"
  .insert({
    property_id: itemId, // veya product_id
    url: imageUrl,
  })
```

### Fotoğraf Silme

```typescript
// 1. Veritabanından sil
await supabase
  .from("property_images")
  .delete()
  .eq("url", imageUrl)

// 2. Storage'dan sil
const fileName = imageUrl.split("/").pop()
await supabase
  .storage
  .from("property-images")
  .remove([`${itemId}/${fileName}`])
```

---

## 🗄️ Veritabanı Yapısı

### Tablolar

#### 1. `profiles`
Kullanıcı profilleri ve kategori bilgileri.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  category TEXT CHECK (category IN ('brew', 'perdeci')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `properties`
Emlak ilanları (Brew Gayrimenkul için).

```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('completed', 'ongoing')),
  year INTEGER,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  city TEXT,
  district TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `property_images`
Emlak fotoğrafları (URL'ler).

```sql
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `products`
Ürünler (Perdeci için).

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. `product_images`
Ürün fotoğrafları (URL'ler).

```sql
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. `subscriptions`
Abonelik bilgileri.

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📦 Storage Yapısı

### Bucket Organizasyonu

```
Supabase Storage
├── property-images/
│   ├── {propertyId1}/
│   │   ├── 1704067200000-0.123.jpg
│   │   ├── 1704067201000-0.456.jpg
│   │   └── ...
│   ├── {propertyId2}/
│   │   └── ...
│   └── ...
└── product-images/
    ├── {productId1}/
    │   ├── 1704067200000-0.789.png
    │   └── ...
    └── ...
```

### Public URL Formatı

```
https://{project-id}.supabase.co/storage/v1/object/public/{bucket-name}/{file-path}
```

**Örnek:**
```
https://umpeanoqdlotaufpiviq.supabase.co/storage/v1/object/public/property-images/abc123/1704067200000-0.123.jpg
```

### Fotoğraf Erişimi

Tüm fotoğraflar **public** olarak erişilebilir. URL'ler doğrudan tarayıcıda açılabilir veya `<img>` tag'inde kullanılabilir.

---

## 🔌 API Kullanımı

### 1. Frontend'den Veri Çekme

#### Ürün Fotoğraflarını Çekme

```typescript
import { createClient } from "@/lib/client"

const supabase = createClient()

// 1. Kullanıcının ürünlerini al
const { data: products } = await supabase
  .from("products")
  .select("id, name, description")
  .eq("user_id", userId)

// 2. Ürün ID'lerini topla
const productIds = products.map(p => p.id)

// 3. Fotoğrafları al
const { data: images } = await supabase
  .from("product_images")
  .select("product_id, url")
  .in("product_id", productIds)

// 4. Grupla
const groupedImages: Record<string, string[]> = {}
images.forEach(img => {
  if (!groupedImages[img.product_id]) {
    groupedImages[img.product_id] = []
  }
  groupedImages[img.product_id].push(img.url)
})

// 5. Kullan
products.forEach(product => {
  const productImages = groupedImages[product.id] || []
  // productImages artık bu ürünün tüm fotoğraflarını içeriyor
})
```

#### Emlak Fotoğraflarını Çekme

```typescript
// 1. Kullanıcının emlaklarını al
const { data: properties } = await supabase
  .from("properties")
  .select("id, title, description, city, district, status, year, progress")
  .eq("user_id", userId)

// 2. Emlak ID'lerini topla
const propertyIds = properties.map(p => p.id)

// 3. Fotoğrafları al
const { data: images } = await supabase
  .from("property_images")
  .select("property_id, url")
  .in("property_id", propertyIds)

// 4. Grupla
const groupedImages: Record<string, string[]> = {}
images.forEach(img => {
  if (!groupedImages[img.property_id]) {
    groupedImages[img.property_id] = []
  }
  groupedImages[img.property_id].push(img.url)
})
```

### 2. Public API ile Veri Çekme

#### Supabase REST API Kullanımı

**Base URL:**
```
https://{project-id}.supabase.co/rest/v1/
```

**Headers:**
```javascript
{
  "apikey": "YOUR_ANON_KEY",
  "Authorization": "Bearer YOUR_ANON_KEY"
}
```

#### Örnek: Tüm Ürünleri ve Fotoğraflarını Çekme

```javascript
// 1. Ürünleri çek
const productsResponse = await fetch(
  'https://umpeanoqdlotaufpiviq.supabase.co/rest/v1/products?select=*',
  {
    headers: {
      'apikey': 'YOUR_ANON_KEY',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    }
  }
)
const products = await productsResponse.json()

// 2. Fotoğrafları çek
const imagesResponse = await fetch(
  'https://umpeanoqdlotaufpiviq.supabase.co/rest/v1/product_images?select=*',
  {
    headers: {
      'apikey': 'YOUR_ANON_KEY',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    }
  }
)
const images = await imagesResponse.json()

// 3. Grupla
const groupedImages = {}
images.forEach(img => {
  if (!groupedImages[img.product_id]) {
    groupedImages[img.product_id] = []
  }
  groupedImages[img.product_id].push(img.url)
})
```

#### Örnek: Belirli Bir Kullanıcının Verilerini Çekme

```javascript
// Kullanıcının email'ine göre user_id bul
const userResponse = await fetch(
  'https://umpeanoqdlotaufpiviq.supabase.co/rest/v1/auth/users?email=eq.musteri@example.com',
  {
    headers: {
      'apikey': 'YOUR_ANON_KEY',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    }
  }
)
const users = await userResponse.json()
const userId = users[0].id

// Kullanıcının ürünlerini çek
const productsResponse = await fetch(
  `https://umpeanoqdlotaufpiviq.supabase.co/rest/v1/products?user_id=eq.${userId}&select=*`,
  {
    headers: {
      'apikey': 'YOUR_ANON_KEY',
      'Authorization': 'Bearer YOUR_ANON_KEY'
    }
  }
)
const products = await productsResponse.json()
```

#### Örnek: Fotoğrafları Doğrudan Storage'dan Çekme

```javascript
// Storage'dan direkt dosya listesi (Supabase Storage API)
// Not: Bu için service role key gerekebilir veya public bucket policy'si olmalı

// Public URL'ler zaten veritabanında, direkt kullanılabilir:
const imageUrl = "https://umpeanoqdlotaufpiviq.supabase.co/storage/v1/object/public/product-images/abc123/1704067200000-0.123.jpg"

// HTML'de kullanım:
<img src={imageUrl} alt="Product" />
```

### 3. Next.js API Routes

#### `/api/images/upload` (POST)

Fotoğraf yükleme endpoint'i.

**Request:**
```javascript
const formData = new FormData()
formData.append('file', file)
formData.append('type', 'property') // veya 'product'
formData.append('itemId', 'property-id-or-product-id')

const response = await fetch('/api/images/upload', {
  method: 'POST',
  body: formData
})
```

**Response:**
```json
{
  "url": "https://...supabase.co/storage/v1/object/public/property-images/abc123/1704067200000-0.123.jpg"
}
```

#### `/api/images/delete` (POST)

Fotoğraf silme endpoint'i.

**Request:**
```javascript
const response = await fetch('/api/images/delete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'image-url',
    type: 'property', // veya 'product'
    itemId: 'property-id-or-product-id'
  })
})
```

---

## 🌐 Frontend'den Veri Çekme

### React Component Örneği

```typescript
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

export function ProductGallery({ userId }: { userId: string }) {
  const [products, setProducts] = useState([])
  const [images, setImages] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // 1. Ürünleri çek
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)

      setProducts(productsData || [])

      // 2. Fotoğrafları çek
      if (productsData && productsData.length > 0) {
        const productIds = productsData.map(p => p.id)
        const { data: imagesData } = await supabase
          .from("product_images")
          .select("product_id, url")
          .in("product_id", productIds)

        // 3. Grupla
        const grouped: Record<string, string[]> = {}
        imagesData?.forEach(img => {
          if (!grouped[img.product_id]) {
            grouped[img.product_id] = []
          }
          grouped[img.product_id].push(img.url)
        })
        setImages(grouped)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <div>
            {images[product.id]?.map((url, idx) => (
              <img key={idx} src={url} alt={product.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔐 Güvenlik

### Row Level Security (RLS)

Tüm tablolarda RLS aktif. Kullanıcılar sadece kendi verilerine erişebilir.

### Storage Policies

Storage bucket'ları public, ancak yükleme için authentication gerekli.

### Güvenlik Kontrolleri

- Fotoğraf yükleme: Kullanıcının item'a sahip olduğu kontrol edilir
- Fotoğraf silme: Kullanıcının item'a sahip olduğu kontrol edilir
- Veri çekme: RLS politikaları ile otomatik filtreleme

---

## 📊 Abonelik Yönetimi

Detaylı bilgi için: `doc/SUPABASE_SUBSCRIPTION_YONETIM.md`

### Hızlı Başlangıç

```sql
-- Yeni subscription oluştur (1 yıl)
INSERT INTO subscriptions (user_id, expires_at)
SELECT id, NOW() + INTERVAL '1 year'
FROM auth.users
WHERE email = 'musteri@example.com';

-- Süreyi uzat (1 yıl ekle)
UPDATE subscriptions
SET expires_at = expires_at + INTERVAL '1 year'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'musteri@example.com'
);
```

---

## 📝 Özet: Fotoğraf Yükleme ve Çekme

### Yükleme Akışı

1. Kullanıcı fotoğraf seçer
2. Frontend → Supabase Storage'a yükler
3. Public URL oluşturulur
4. URL → Database'e kaydedilir (`property_images` veya `product_images`)

### Çekme Akışı

1. Database'den URL'leri çek (`property_images` veya `product_images`)
2. URL'ler zaten public, direkt kullanılabilir
3. `<img src={url} />` ile göster

### Önemli Notlar

- ✅ Tüm fotoğraflar **public** olarak erişilebilir
- ✅ URL'ler doğrudan tarayıcıda açılabilir
- ✅ Veritabanında sadece URL'ler saklanır, dosyalar Storage'da
- ✅ Storage bucket'ları public olmalı
- ✅ RLS ile kullanıcılar sadece kendi verilerine erişir

---

## 🆘 Sorun Giderme

### Fotoğraflar görünmüyor

1. Storage bucket'larının public olduğunu kontrol edin
2. Storage policy'lerinin doğru olduğunu kontrol edin
3. URL'lerin doğru format'ta olduğunu kontrol edin

### Yükleme hatası

1. Authentication kontrolü yapın
2. Bucket isimlerinin doğru olduğunu kontrol edin
3. Dosya boyutu limitlerini kontrol edin (varsayılan: 50MB)

### Veri çekme hatası

1. RLS politikalarını kontrol edin
2. API key'lerin doğru olduğunu kontrol edin
3. Network tab'ında hata mesajlarını kontrol edin

---

## 📚 İlgili Dosyalar

Tüm dökümantasyon dosyaları `doc/` klasöründe:

- `doc/SUPABASE_KURULUM.md` - Hızlı kurulum referansı
- `doc/SUPABASE_SUBSCRIPTION_YONETIM.md` - Detaylı abonelik yönetimi (SQL örnekleri)
- `doc/SUPABASE_SUBSCRIPTION_SETUP.sql` - Subscription tablo oluşturma script'i
- `doc/SUPABASE_PROPERTIES_UPDATE.sql` - Properties tablo güncelleme script'i
- `doc/PROJE_ACIKLAMA.md` - Proje genel açıklaması ve yeni şirket ekleme

---

**Son Güncelleme:** 2024

