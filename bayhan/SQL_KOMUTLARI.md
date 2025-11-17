# PostgreSQL SQL Komutları - Adım Adım

## 🚀 Hızlı Başlangıç

### Yöntem 1: pgAdmin ile (Kolay)

1. **pgAdmin'i aç**
2. **"Servers" → "BayhanTech" (veya oluşturduğun server) → "postgres" veritabanına bağlan**
3. **Query Tool aç (F5 veya sağ tık → Query Tool)**

### Yöntem 2: psql ile (Komut satırı)

```powershell
# PostgreSQL bin klasörüne git
cd "C:\Program Files\PostgreSQL\16\bin"

# psql'e bağlan
.\psql -U postgres

# Şifre sorulacak, PostgreSQL kurulumunda belirlediğin şifreyi gir
```

---

## 📝 ADIM 1: postgres Veritabanında Çalıştır

**ÖNEMLİ:** İlk komutları `postgres` veritabanında çalıştır!

### 1.1. Kullanıcı Oluştur

```sql
-- Kullanıcı oluştur (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'bayhan_user') THEN
    CREATE ROLE bayhan_user WITH LOGIN PASSWORD 'kemalpasayialicam';
  END IF;
END
$$;
```

### 1.2. Veritabanı Oluştur

```sql
-- Veritabanı oluştur
CREATE DATABASE bayhan OWNER bayhan_user;
```

**pgAdmin'de:** `postgres` veritabanında Query Tool aç ve yukarıdaki komutları çalıştır.

**psql'de:** Zaten `postgres` veritabanındasın, direkt çalıştır.

---

## 📝 ADIM 2: bayhan Veritabanına Geç

### pgAdmin'de:
1. **Sol tarafta "bayhan" veritabanına tıkla**
2. **Sağ tık → "Query Tool"** (yeni bir Query Tool aç)

### psql'de:
```sql
\c bayhan
```

---

## 📝 ADIM 3: bayhan Veritabanında Çalıştır

### 3.1. UUID Extension Ekle

```sql
-- UUID extension'ı ekle (Prisma için gerekli)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3.2. Kullanıcıya Yetki Ver

```sql
-- Schema yetkileri
GRANT ALL ON SCHEMA public TO bayhan_user;

-- Tablo yetkileri (gelecekte oluşturulacak tablolar için)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bayhan_user;

-- Sequence yetkileri (ID'ler için)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bayhan_user;
```

### 3.3. Kontrol Et

```sql
-- Başarı mesajı
SELECT 'Veritabanı kurulumu tamamlandı!' AS status;
```

---

## ✅ Tüm Komutlar (Tek Seferde)

Eğer `setup-database.sql` dosyasını kullanmak istersen:

### pgAdmin'de:
1. **postgres veritabanında Query Tool aç**
2. **İlk iki komutu çalıştır** (kullanıcı ve veritabanı oluştur)
3. **bayhan veritabanında yeni Query Tool aç**
4. **Kalan komutları çalıştır** (extension ve yetkiler)

### psql'de:
```sql
-- postgres veritabanında
\i "D:\githubProjects\BayhanTech\bayhan\prisma\setup-database.sql"
```

**NOT:** psql'de dosya yolu farklı olabilir, kendi yolunu kullan.

---

## 🎯 Sonraki Adımlar

SQL komutlarını çalıştırdıktan sonra:

1. ✅ `.env` dosyasını kontrol et:
   ```env
   DATABASE_URL="postgresql://bayhan_user:kemalpasayialicam@localhost:5432/bayhan?schema=public"
   ```

2. ✅ Prisma generate:
   ```bash
   npm run prisma:generate
   ```

3. ✅ Migration çalıştır:
   ```bash
   npm run prisma:migrate
   ```

4. ✅ Seed data (opsiyonel):
   ```bash
   npm run prisma:seed
   ```

---

## 🚨 Sorun Giderme

### "role already exists" hatası
- Kullanıcı zaten var, devam et (sorun değil)

### "database already exists" hatası
- Veritabanı zaten var, devam et (sorun değil)

### "permission denied" hatası
- `postgres` kullanıcısıyla bağlandığından emin ol
- PostgreSQL kurulumunda belirlediğin admin şifresini kullan

### "extension already exists" hatası
- Extension zaten var, devam et (sorun değil)


