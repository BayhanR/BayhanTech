# Supabase Kurulum Rehberi

> **📚 Kapsamlı Dökümantasyon:** Tüm sistem hakkında detaylı bilgi için `doc/PORTAL_TAM_DOKUMANTASYON.md` dosyasına bakın.

Portal'ın çalışması için Supabase yapılandırması gerekiyor. Bu rehber adım adım kurulumu anlatır.

## 📋 Adımlar

### 1. Supabase Hesabı ve Proje Oluşturma

1. **Supabase'e gidin**: https://supabase.com
2. **Hesap oluşturun** (ücretsiz)
3. **"New Project"** butonuna tıklayın
4. Proje bilgilerini doldurun:
   - **Name**: Proje adı (örn: "bayhan-portal")
   - **Database Password**: Güçlü bir şifre (kaydedin!)
   - **Region**: Size en yakın bölge
5. **"Create new project"** butonuna tıklayın
6. Proje oluşturulmasını bekleyin (2-3 dakika)

### 2. API Keys'i Alma

1. Supabase dashboard'da sol menüden **"Settings"** (⚙️) seçin
2. **"API"** sekmesine gidin
3. Şu bilgileri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. .env.local Dosyasını Doldurma

`bayhan/.env.local` dosyasını açın ve değerleri doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Önemli:** 
- Değerleri tırnak işareti olmadan yazın
- `NEXT_PUBLIC_` prefix'ini mutlaka kullanın
- Dosyayı kaydedin

### 4. Veritabanı Tablolarını Oluşturma

Supabase dashboard'da:

1. Sol menüden **"SQL Editor"** seçin
2. **"New query"** butonuna tıklayın
3. Aşağıdaki SQL script'lerini sırayla çalıştırın:

#### 4.1. Profiles Tablosu
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  category TEXT CHECK (category IN ('brew', 'perdeci')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.2. Properties Tablosu (Brew Dashboard için)
```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.3. Products Tablosu (Perdeci Dashboard için)
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.4. Image Tabloları
```sql
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.5. Subscriptions Tablosu (Abonelik Yönetimi)
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
```

**Detaylı kurulum için:** `doc/SUPABASE_SUBSCRIPTION_SETUP.sql` dosyasına bakın.

#### 4.6. Profile Trigger (Otomatik Profile Oluşturma)
```sql
-- Yeni kullanıcı kaydolduğunda otomatik profile oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, category)
  VALUES (NEW.id, 'brew');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Row Level Security (RLS) Politikaları

Güvenlik için RLS politikalarını ekleyin:

```sql
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own properties" ON properties FOR ALL USING (auth.uid() = user_id);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = user_id);

-- Property Images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own property images" ON property_images FOR ALL 
  USING (auth.uid() IN (SELECT user_id FROM properties WHERE id = property_images.property_id));

-- Product Images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own product images" ON product_images FOR ALL 
  USING (auth.uid() IN (SELECT user_id FROM products WHERE id = product_images.product_id));
```

### 6. Storage Bucket'ları Oluşturma

1. Sol menüden **"Storage"** seçin
2. **"Create a new bucket"** butonuna tıklayın
3. İlk bucket'ı oluşturun:
   - **Name**: `property-images`
   - **Public bucket**: ✅ (işaretleyin)
   - **"Create bucket"** butonuna tıklayın
4. İkinci bucket'ı oluşturun:
   - **Name**: `product-images`
   - **Public bucket**: ✅ (işaretleyin)
   - **"Create bucket"** butonuna tıklayın

### 7. Storage Politikaları

Her bucket için policy ekleyin:

#### property-images Bucket için:
1. `property-images` bucket'ına tıklayın
2. **"Policies"** sekmesine gidin
3. **"New Policy"** → **"For full customization"** seçin
4. Policy adı: `Allow authenticated uploads`
5. Policy definition:
```sql
(
  bucket_id = 'property-images'::text
)
WITH CHECK (
  (auth.role() = 'authenticated'::text)
)
```
6. **"Review"** → **"Save policy"**

#### product-images Bucket için:
Aynı adımları `product-images` bucket'ı için tekrarlayın.

### 8. Test Etme

1. Development server'ı yeniden başlatın:
```bash
cd bayhan
npm run dev
```

2. Portal'a gidin: http://localhost:3002/portal

3. Yeni kullanıcı kaydı oluşturun:
   - **Sign Up** butonuna tıklayın
   - Email ve şifre girin
   - Kategori seçin (Brew veya Perdeci)
   - Kayıt olun

4. Email doğrulaması:
   - Supabase'den gönderilen email'i kontrol edin
   - Email'deki link'e tıklayarak hesabı doğrulayın

5. Giriş yapın ve dashboard'u test edin

## ✅ Kontrol Listesi

- [ ] Supabase projesi oluşturuldu
- [ ] `.env.local` dosyası dolduruldu
- [ ] Tüm tablolar oluşturuldu
- [ ] RLS politikaları eklendi
- [ ] Storage bucket'ları oluşturuldu
- [ ] Storage politikaları eklendi
- [ ] Test kullanıcısı oluşturuldu
- [ ] Portal çalışıyor

## 🐛 Sorun Giderme

### "Supabase client is not initialized" Hatası
- `.env.local` dosyasının `bayhan/` klasöründe olduğundan emin olun
- Değişkenlerin `NEXT_PUBLIC_` ile başladığından emin olun
- Server'ı yeniden başlatın

### "Unauthorized" Hatası
- Kullanıcının email'ini doğruladığından emin olun
- RLS politikalarının doğru kurulduğunu kontrol edin

### Resim Yükleme Hatası
- Storage bucket'larının public olduğundan emin olun
- Storage politikalarının eklendiğinden emin olun

## 📞 Yardım

Sorun yaşarsanız:
- Supabase dokümantasyonu: https://supabase.com/docs
- Kapsamlı dökümantasyon: `doc/PORTAL_TAM_DOKUMANTASYON.md`

