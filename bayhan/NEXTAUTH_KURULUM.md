# NextAuth.js Kurulum Rehberi

## 📋 Gerekli Environment Variables

`.env.local` veya `.env` dosyasına şu değişkenleri ekle:

```env
# Database (Prisma için)
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/bayhan?schema=public"

# NextAuth.js (ZORUNLU)
AUTH_SECRET="güçlü-bir-secret-key-buraya"

# Upload klasörü (opsiyonel, varsayılan değer var)
UPLOAD_ROOT="C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads"

# App URL (opsiyonel)
NEXT_PUBLIC_APP_URL="http://localhost:3002"
```

## 🔑 AUTH_SECRET Oluşturma

AUTH_SECRET için güçlü bir key oluştur:

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Çıkan değeri `.env` dosyasına `AUTH_SECRET=` olarak ekle.

## 📦 Kurulum Adımları

1. **Paketleri yükle:**
   ```bash
   npm install
   ```

2. **Prisma generate:**
   ```bash
   npm run prisma:generate
   ```

3. **Database migration (ilk kurulumda):**
   ```bash
   npm run prisma:migrate
   ```

4. **Seed data (opsiyonel):**
   ```bash
   npm run prisma:seed
   ```

5. **Development server'ı başlat:**
   ```bash
   npm run dev
   ```

## ✅ Kontrol Listesi

- [ ] `.env` dosyası oluşturuldu
- [ ] `DATABASE_URL` eklendi
- [ ] `AUTH_SECRET` eklendi (güçlü bir key)
- [ ] `npm install` çalıştırıldı
- [ ] `npm run prisma:generate` çalıştırıldı
- [ ] Database migration yapıldı (ilk kurulumda)

## 🚀 Production'da

Production'da `AUTH_SECRET` mutlaka güçlü ve güvenli olmalıdır. Her deployment'ta aynı key kullanılmalıdır.

