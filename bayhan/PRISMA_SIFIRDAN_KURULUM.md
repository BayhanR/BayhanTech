# Prisma Sıfırdan Kurulum Rehberi

## 📋 Ön Gereksinimler

1. ✅ PostgreSQL kurulu ve çalışıyor olmalı
2. ✅ `.env` dosyası hazır olmalı
3. ✅ `npm install` yapılmış olmalı

---

## 🚀 Adım Adım Kurulum

### ADIM 1: PostgreSQL Kontrolü

```powershell
# PostgreSQL servisinin çalıştığını kontrol et
Get-Service -Name "*postgresql*"

# Port 5432'nin açık olduğunu kontrol et
Test-NetConnection -ComputerName localhost -Port 5432
```

**Eğer çalışmıyorsa:**
```powershell
# Servisi başlat
Start-Service postgresql-x64-16
# (veya bulduğun servis adı)
```

---

### ADIM 2: PostgreSQL'de Veritabanı ve Kullanıcı Oluştur

**pgAdmin ile:**
1. pgAdmin'i aç
2. "Servers" → "BayhanTech" → "postgres" veritabanına bağlan
3. Query Tool aç (F5)

**psql ile:**
```powershell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql -U postgres
```

**SQL Komutları (postgres veritabanında çalıştır):**

```sql
-- 1. Kullanıcı oluştur
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'bayhan_user') THEN
    CREATE ROLE bayhan_user WITH LOGIN PASSWORD 'kemalpasayialicam';
  END IF;
END
$$;

-- 2. Veritabanı oluştur
CREATE DATABASE bayhan OWNER bayhan_user;
```

**bayhan veritabanına geç:**

pgAdmin'de: Sol tarafta "bayhan" veritabanına tıkla → Sağ tık → "Query Tool"

psql'de:
```sql
\c bayhan
```

**bayhan veritabanında çalıştır:**

```sql
-- 3. UUID extension ekle
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Yetkileri ver
GRANT ALL ON SCHEMA public TO bayhan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bayhan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bayhan_user;
```

---

### ADIM 3: .env Dosyasını Kontrol Et

`.env` dosyası `bayhan` klasöründe olmalı:

```env
DATABASE_URL="postgresql://bayhan_user:kemalpasayialicam@localhost:5432/bayhan?schema=public"
AUTH_SECRET="güçlü-bir-secret-key-buraya"
UPLOAD_ROOT="C:\\inetpub\\wwwroot\\BayhanTech\\bayhan\\uploads"
NEXT_PUBLIC_APP_URL="http://localhost:3002"
```

**AUTH_SECRET oluştur:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Çıkan değeri `.env` dosyasına `AUTH_SECRET=` olarak ekle.

---

### ADIM 4: Prisma Client Generate

```bash
npm run prisma:generate
```

**Beklenen çıktı:**
```
✔ Generated Prisma Client (v6.19.0) to .\node_modules\@prisma\client
```

---

### ADIM 5: Migration Çalıştır (Tablo Oluştur)

```bash
npm run prisma:migrate
```

**İlk migration için:**
- Migration adı sorulacak: `init` yaz ve Enter'a bas
- Tablolar oluşturulacak

**Beklenen çıktı:**
```
✔ Migration applied successfully
```

---

### ADIM 6: Seed Data (Opsiyonel - Test Verileri)

```bash
npm run prisma:seed
```

**Beklenen çıktı:**
```
🌱 Seed başlatılıyor...
✅ Şirketler oluşturuldu
✅ Test kullanıcısı oluşturuldu
✅ Abonelik oluşturuldu
🎉 Seed tamamlandı!
```

---

### ADIM 7: Kontrol Et

```bash
npm run prisma:test
```

**Beklenen çıktı:**
```
✅ Veritabanı bağlantısı başarılı
📊 Kullanıcı sayısı: 1
📊 Şirket sayısı: 3
📊 Profil sayısı: 1
```

---

## ✅ Hızlı Kontrol Listesi

- [ ] PostgreSQL servisi çalışıyor
- [ ] `bayhan_user` kullanıcısı oluşturuldu
- [ ] `bayhan` veritabanı oluşturuldu
- [ ] UUID extension eklendi
- [ ] Yetkiler verildi
- [ ] `.env` dosyası hazır (`DATABASE_URL`, `AUTH_SECRET`)
- [ ] `npm run prisma:generate` başarılı
- [ ] `npm run prisma:migrate` başarılı
- [ ] `npm run prisma:test` başarılı

---

## 🚨 Sorun Giderme

### "Missing required environment variable: DATABASE_URL"
- `.env` dosyasının `bayhan` klasöründe olduğundan emin ol
- `DATABASE_URL` değerinin doğru olduğunu kontrol et

### "Can't reach database server"
- PostgreSQL servisinin çalıştığını kontrol et
- Port 5432'nin açık olduğunu kontrol et

### "password authentication failed"
- `DATABASE_URL`'deki şifrenin doğru olduğunu kontrol et
- PostgreSQL'de `bayhan_user` kullanıcısının şifresini kontrol et

### "relation does not exist"
- Migration çalıştırılmamış: `npm run prisma:migrate`

### "Prisma Client has not been generated yet"
- Generate çalıştırılmamış: `npm run prisma:generate`

---

## 📝 Tüm Komutlar (Tek Seferde)

```bash
# 1. PostgreSQL kontrolü
Get-Service -Name "*postgresql*"

# 2. Prisma generate
npm run prisma:generate

# 3. Migration
npm run prisma:migrate

# 4. Seed (opsiyonel)
npm run prisma:seed

# 5. Test
npm run prisma:test
```

---

## 🎯 Sonraki Adımlar

Prisma kurulumu tamamlandıktan sonra:

1. ✅ Build yap: `npm run build`
2. ✅ Development server başlat: `npm run dev`
3. ✅ Tarayıcıda aç: `http://localhost:3002/portal`

---

## 💡 İpucu: Prisma Studio

Veritabanını görsel olarak görmek için:

```bash
npm run prisma:studio
```

Tarayıcıda `http://localhost:5555` açılacak ve tüm tabloları görebilirsin.


