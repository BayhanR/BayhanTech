# 🪟 Perdi Projesi - Fotoğraf Filtreleme Rehberi

## 🎯 Problem

Perdi projesi `GET /api/products` endpoint'inden tüm product'ları çekiyor. Bu endpoint Brew, Tezerperde ve Mina Giyim'in tüm product'larını döndürüyor. Perdi projesi sadece **Tezerperde** (category: `"perdeci"`) fotoğraflarını göstermeli.

---

## ✅ Çözüm 1: API Query Parameter ile Filtreleme (Önerilen)

### API Endpoint Güncellemesi

BayhanTech API'sine `category` query parametresi eklendi:

```
GET /api/products?category=perdeci
```

**Kullanım:**

```typescript
// lib/bayhan-api.ts
const BAYHAN_API_URL = process.env.BAYHAN_API_URL || 'https://bayhan.tech'

export async function getTezerperdeProducts() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Token varsa ekle (opsiyonel)
    if (process.env.BAYHAN_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.BAYHAN_API_TOKEN}`
    }
    
    // Sadece Tezerperde (perdeci) product'larını çek
    const response = await fetch(
      `${BAYHAN_API_URL}/api/products?category=perdeci`,
      { headers }
    )
    
    if (!response.ok) {
      console.error(`Bayhan API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Tezerperde products fetch error:', error)
    return []
  }
}
```

**Avantajlar:**
- ✅ Server-side filtreleme (daha hızlı)
- ✅ Gereksiz veri transferi yok
- ✅ Daha az network trafiği

---

## ✅ Çözüm 2: Client-Side Filtreleme

Eğer API'ye query parameter eklemek istemiyorsan, client-side'da filtreleme yapabilirsin:

### React Component Örneği

```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  category: string | null
  images: string[]
  createdAt: string
}

export function TezerperdeGallery() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const BAYHAN_API_URL = process.env.NEXT_PUBLIC_BAYHAN_API_URL || 'https://bayhan.tech'
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (process.env.NEXT_PUBLIC_BAYHAN_API_TOKEN) {
          headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_BAYHAN_API_TOKEN}`
        }
        
        const response = await fetch(`${BAYHAN_API_URL}/api/products`, { headers })
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        // Sadece Tezerperde (perdeci) product'larını filtrele
        const tezerperdeProducts = data.products.filter(
          (product: Product) => product.category === 'perdeci'
        )
        
        setProducts(tezerperdeProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          <h3 className="p-4 font-semibold">{product.name}</h3>
          {product.images.length > 0 && (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={600}
              className="w-full h-auto object-cover"
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## 📋 Category Listesi

BayhanTech sistemindeki category'ler:

| Category | Açıklama | Kullanım |
|----------|----------|----------|
| `perdeci` | Tezerperde.com | Perdi projesi için |
| `brew` | Brew Gayrimenkul | Brew sitesi için |
| `mina` | Mina Giyim | Mina sitesi için |
| `balyum` | Balyum | - |
| `petmezarligi` | Petmezarlığı | - |

---

## 🔧 Environment Variables

Perdi projesinde `.env.local` dosyasına ekle:

```env
NEXT_PUBLIC_BAYHAN_API_URL="https://bayhan.tech"
NEXT_PUBLIC_BAYHAN_API_TOKEN="your-token-here"  # Opsiyonel
```

---

## 📝 Tam Entegrasyon Örneği

### 1. API Helper Fonksiyonu

```typescript
// lib/bayhan-api.ts

const BAYHAN_API_URL = process.env.NEXT_PUBLIC_BAYHAN_API_URL || 'https://bayhan.tech'
const BAYHAN_API_TOKEN = process.env.NEXT_PUBLIC_BAYHAN_API_TOKEN

export interface BayhanProduct {
  id: string
  name: string
  description: string | null
  category: string | null
  images: string[]
  createdAt: string
}

export async function getTezerperdeProducts(): Promise<BayhanProduct[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (BAYHAN_API_TOKEN) {
      headers['Authorization'] = `Bearer ${BAYHAN_API_TOKEN}`
    }
    
    // Method 1: Query parameter ile (önerilen)
    const response = await fetch(
      `${BAYHAN_API_URL}/api/products?category=perdeci`,
      { headers }
    )
    
    if (!response.ok) {
      console.error(`Bayhan API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Tezerperde products fetch error:', error)
    return []
  }
}

// VEYA Method 2: Client-side filtreleme
export async function getAllProducts(): Promise<BayhanProduct[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (BAYHAN_API_TOKEN) {
      headers['Authorization'] = `Bearer ${BAYHAN_API_TOKEN}`
    }
    
    const response = await fetch(`${BAYHAN_API_URL}/api/products`, { headers })
    
    if (!response.ok) {
      console.error(`Bayhan API error: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Products fetch error:', error)
    return []
  }
}

export function filterByCategory(
  products: BayhanProduct[],
  category: string
): BayhanProduct[] {
  return products.filter((product) => product.category === category)
}
```

### 2. React Component

```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getTezerperdeProducts, type BayhanProduct } from '@/lib/bayhan-api'

export function PerdiGallery() {
  const [products, setProducts] = useState<BayhanProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Sadece Tezerperde product'larını çek
        const tezerperdeProducts = await getTezerperdeProducts()
        setProducts(tezerperdeProducts)
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Henüz ürün bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <h3 className="p-4 font-semibold text-center">{product.name}</h3>
          {product.images.length > 0 ? (
            <div className="relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">Resim bulunamadı</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] `.env.local` dosyasına `NEXT_PUBLIC_BAYHAN_API_URL` eklendi
- [ ] `lib/bayhan-api.ts` oluşturuldu
- [ ] `getTezerperdeProducts()` fonksiyonu kullanılıyor
- [ ] Component'lerde sadece `category === 'perdeci'` product'ları gösteriliyor
- [ ] `next.config.ts`'de `bayhan.tech` domain'i eklendi

---

## 🆘 Sorun Giderme

### Tüm product'lar geliyor
- Query parameter kullanıyorsan: `?category=perdeci` parametresini kontrol et
- Client-side filtreleme yapıyorsan: `product.category === 'perdeci'` kontrolünü kontrol et

### Category bilgisi null geliyor
- API response'unda `category` field'ının geldiğini kontrol et
- Veritabanında user'ın profile'ının ve company'sinin doğru olduğunu kontrol et

### 401 Unauthorized
- Token doğru mu kontrol et
- `NEXT_PUBLIC_BAYHAN_API_TOKEN` environment variable'ı doğru mu kontrol et

---

## 📞 Destek

Sorun yaşarsanız, BayhanTech projesindeki `RESIM_PAYLASIM_REHBERI.md` dosyasına bakın.

