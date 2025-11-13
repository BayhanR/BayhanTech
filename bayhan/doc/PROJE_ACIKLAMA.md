# Portal Projesi - Ne Yapıyor?

> **📚 Kapsamlı Dökümantasyon:** Tüm sistem hakkında detaylı bilgi için `doc/PORTAL_TAM_DOKUMANTASYON.md` dosyasına bakın.

## 🎯 Projenin Amacı

Bu proje, **çoklu şirket yönetim sistemi** (multi-tenant portal) sağlar. Her şirket kendi dashboard'una sahiptir ve kendi içeriklerini yönetir.

## 📋 Mevcut Durum

### Şu Anki Şirketler:

1. **Brew Gayrimenkul** (`brew`)
   - Emlak ilanları yönetimi
   - İnşaat projeleri (biten/devam eden)
   - Fotoğraf yükleme
   - İl/İlçe, yıl, ilerleme yüzdesi bilgileri

2. **Tezerperde.com** (`perdeci`)
   - Perde ürün galerisi
   - Sadece fotoğraf yükleme (otomatik ürün oluşturma)
   - Ürün yönetimi

## 🔄 Nasıl Çalışıyor?

1. **Giriş Sayfası**: Kullanıcı şirket logosunu seçer
2. **Login**: Email/şifre ile giriş yapar
3. **Dashboard**: Seçilen şirkete göre farklı dashboard gösterilir:
   - `brew` → BrewDashboard (Emlak yönetimi)
   - `perdeci` → PerdecDashboard (Ürün galerisi)

## ➕ Yeni Şirket Ekleme Adımları

### 1. Logo Dosyası Ekleme

`bayhan/public/` klasörüne şirket logosunu ekleyin:
- Örnek: `/public/mina-logo.png`

### 2. Portal Page'e Şirket Ekleme

`bayhan/components/portal-page.tsx` dosyasında `businesses` array'ine yeni şirket ekleyin:

```typescript
const businesses = [
  // ... mevcut şirketler
  {
    id: "mina",  // Benzersiz ID
    name: "Mina Giyim",
    category: "mina",  // ÖNEMLİ: Bu category dashboard seçimi için kullanılır
    description: "Moda ve giyim ürünleri",
    logo: "/mina-logo.png",  // Public klasöründeki logo yolu
  },
]
```

### 3. Supabase'te Category Güncelleme

**Supabase SQL Editor'de:**

```sql
-- Profiles tablosundaki CHECK constraint'i güncelle
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_category_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_category_check 
CHECK (category IN ('brew', 'perdeci', 'mina'));
```

### 4. Yeni Dashboard Component Oluşturma

`bayhan/components/` klasörüne yeni dashboard component'i ekleyin:

**Örnek: `mina-dashboard.tsx`**

```typescript
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
// ... diğer import'lar

export function MinaDashboard({ userId }: { userId: string }) {
  // Mina'ya özel dashboard mantığı
  // Örnek: Kıyafet adı, tarih, fiyat, fotoğraf formu
  
  return (
    <div className="space-y-8">
      <h1>Mina Giyim Dashboard</h1>
      {/* Mina'ya özel form ve galeri */}
    </div>
  )
}
```

### 5. Dashboard Page'e Yeni Şirketi Ekleme

`bayhan/app/portal/dashboard/page.tsx` dosyasında:

```typescript
import { MinaDashboard } from "@/components/mina-dashboard"

// ...

{profile.category === "brew" ? (
  <BrewDashboard userId={data.user.id} />
) : profile.category === "perdeci" ? (
  <PerdecDashboard userId={data.user.id} />
) : profile.category === "mina" ? (
  <MinaDashboard userId={data.user.id} />
) : (
  <div>Bilinmeyen kategori</div>
)}
```

### 6. Yeni Şirket İçin Veritabanı Tablosu (Gerekirse)

Eğer yeni şirket farklı bir veri yapısı gerektiriyorsa:

**Supabase SQL Editor'de:**

```sql
-- Örnek: Mina için products tablosu kullanılabilir
-- Veya yeni bir tablo oluşturulabilir
CREATE TABLE IF NOT EXISTS mina_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📝 Özet: Yeni Şirket Ekleme Checklist

- [ ] Logo dosyası `/public/` klasörüne eklendi
- [ ] `portal-page.tsx`'te `businesses` array'ine eklendi
- [ ] Supabase'te `profiles.category` CHECK constraint güncellendi
- [ ] Yeni dashboard component oluşturuldu
- [ ] `dashboard/page.tsx`'te yeni şirket için routing eklendi
- [ ] Gerekirse yeni veritabanı tablosu oluşturuldu
- [ ] Test edildi

## 🎨 Dashboard Türleri

### 1. Basit Fotoğraf Yükleme (Perdeci gibi)
- Sadece fotoğraf yükleme
- Otomatik ürün oluşturma
- Galeri görünümü

### 2. Detaylı Form (Brew gibi)
- Kategori seçimi (biten/devam eden)
- Çoklu alan (yıl, ilerleme, il, ilçe)
- Fotoğraf yükleme
- Detaylı bilgi gösterimi

### 3. Özel Form (Mina Giyim gibi - gelecek)
- Ürün adı
- Tarih
- Fiyat
- Kategori
- Fotoğraf
- Daha fazla alan

## 🔐 Güvenlik

- Her kullanıcı sadece kendi içeriklerini görebilir (RLS)
- Her şirket kendi dashboard'una erişir
- Category bilgisi kullanıcı profilinde saklanır

## 📊 Mevcut Özellikler

- ✅ Çoklu şirket desteği
- ✅ Şirket bazlı dashboard'lar
- ✅ Fotoğraf yükleme (Supabase Storage)
- ✅ Widget'lar (Hava, Borsa, Emtia, Haberler)
- ✅ Destek ticket formu
- ✅ Dark mode toggle
- ✅ Türkçe arayüz

