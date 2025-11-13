# Subscription (Abonelik) Yönetim Rehberi

Bu rehber, müşteri abonelik sürelerini Supabase veritabanından nasıl yöneteceğinizi açıklar.

## 📋 Subscription Tablosu

Subscription tablosu şu alanları içerir:
- `id`: Benzersiz ID
- `user_id`: Kullanıcı ID (auth.users ile ilişkili)
- `expires_at`: Abonelik bitiş tarihi (TIMESTAMP)
- `created_at`: Oluşturulma tarihi
- `updated_at`: Güncellenme tarihi

## 🔧 Supabase'den Yönetim

### 1. Supabase Dashboard'dan Yönetim

1. **Supabase Dashboard'a gidin**: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **"Table Editor"** seçin
4. **"subscriptions"** tablosunu açın
5. İstediğiniz kullanıcının subscription'ını bulun ve düzenleyin

### 2. SQL Editor ile Yönetim

Supabase Dashboard → **SQL Editor** → **New query**

#### Yeni Subscription Oluşturma

```sql
-- Kullanıcının email'ine göre subscription oluştur
INSERT INTO subscriptions (user_id, expires_at)
SELECT id, NOW() + INTERVAL '1 year'  -- 1 yıl ekle
FROM auth.users
WHERE email = 'musteri@example.com';
```

#### Mevcut Subscription'ı Uzatma

```sql
-- Tezerperde kullanıcısının süresini 1 yıl uzat
UPDATE subscriptions
SET expires_at = expires_at + INTERVAL '1 year'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'tezerperde@example.com'
);
```

#### Belirli Bir Tarihe Ayarlama

```sql
-- Tezerperde kullanıcısının bitiş tarihini 2025-12-31 yap
UPDATE subscriptions
SET expires_at = '2025-12-31 23:59:59+00'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'tezerperde@example.com'
);
```

#### Tüm Kullanıcıları 1 Yıl Uzatma

```sql
-- Tüm aktif subscription'ları 1 yıl uzat
UPDATE subscriptions
SET expires_at = expires_at + INTERVAL '1 year'
WHERE expires_at > NOW();
```

#### Kullanıcı Email'ine Göre Subscription Bulma

```sql
-- Kullanıcının subscription bilgisini görüntüle
SELECT 
  u.email,
  s.expires_at,
  s.expires_at - NOW() as days_remaining,
  CASE 
    WHEN s.expires_at > NOW() THEN 'Aktif'
    ELSE 'Süresi Dolmuş'
  END as status
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'musteri@example.com';
```

#### Tüm Subscription'ları Listeleme

```sql
-- Tüm kullanıcıların subscription durumunu görüntüle
SELECT 
  u.email,
  u.created_at as user_created,
  s.expires_at,
  s.expires_at - NOW() as days_remaining,
  CASE 
    WHEN s.expires_at > NOW() THEN 'Aktif'
    ELSE 'Süresi Dolmuş'
  END as status
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
ORDER BY s.expires_at DESC;
```

#### Yakında Sona Erecek Subscription'ları Bulma

```sql
-- 30 gün içinde sona erecek subscription'ları bul
SELECT 
  u.email,
  s.expires_at,
  s.expires_at - NOW() as days_remaining
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.expires_at BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY s.expires_at ASC;
```

#### Süresi Dolmuş Subscription'ları Bulma

```sql
-- Süresi dolmuş tüm subscription'ları bul
SELECT 
  u.email,
  s.expires_at,
  NOW() - s.expires_at as days_overdue
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.expires_at < NOW()
ORDER BY s.expires_at ASC;
```

## 📝 Örnek Senaryolar

### Senaryo 1: Tezerperde'nin Süresini 1 Yıl Uzatma

```sql
-- 1. Önce kullanıcıyı bul
SELECT id, email FROM auth.users WHERE email LIKE '%tezer%';

-- 2. Subscription'ı güncelle (email'e göre)
UPDATE subscriptions
SET expires_at = expires_at + INTERVAL '1 year'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'tezerperde@example.com'
);

-- 3. Kontrol et
SELECT 
  u.email,
  s.expires_at,
  s.expires_at - NOW() as days_remaining
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'tezerperde@example.com';
```

### Senaryo 2: Yeni Müşteri İçin Subscription Oluşturma

```sql
-- Kullanıcı zaten varsa
INSERT INTO subscriptions (user_id, expires_at)
SELECT id, NOW() + INTERVAL '1 year'
FROM auth.users
WHERE email = 'yeni@musteri.com'
ON CONFLICT (user_id) DO UPDATE
SET expires_at = subscriptions.expires_at + INTERVAL '1 year';
```

### Senaryo 3: Belirli Bir Tarihe Ayarlama

```sql
-- 2026 yılının sonuna kadar uzat
UPDATE subscriptions
SET expires_at = '2026-12-31 23:59:59+00'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'musteri@example.com'
);
```

## ⚠️ Önemli Notlar

1. **Service Role Key Kullanımı**: 
   - RLS politikaları nedeniyle, admin işlemleri için **Service Role Key** kullanmanız gerekebilir
   - Supabase Dashboard → Settings → API → `service_role` key

2. **Zaman Dilimi**: 
   - Tüm tarihler UTC olarak saklanır
   - Türkiye saati için +3 saat ekleyin

3. **Güvenlik**: 
   - Production'da direkt SQL çalıştırmadan önce yedek alın
   - Test ortamında önce deneyin

4. **Backup**: 
   - Önemli güncellemelerden önce veritabanı yedeği alın

## 🔍 Dashboard'da Görüntüleme

Subscription bilgisi dashboard'da otomatik olarak gösterilir:
- Kalan gün sayısı
- Bitiş tarihi
- Uyarılar (30 gün içinde sona erecekse)
- Durum (Aktif/Süresi Dolmuş)

