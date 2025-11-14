# Prisma Kontrol Rehberi

## 🔍 Prisma'yı Kontrol Etme Yöntemleri

### 1. Prisma Studio (Görsel Arayüz) - EN KOLAY

Prisma Studio, veritabanını görsel olarak görmenizi sağlar:

```bash
npm run prisma:studio
```

Bu komut:
- Tarayıcıda `http://localhost:5555` adresini açar
- Tüm tabloları görsel olarak gösterir
- Verileri düzenlemenize, eklemenize, silmenize izin verir

### 2. Test Script'i Çalıştır

Prisma bağlantısını ve verileri kontrol et:

```bash
npm run prisma:test
```

Bu script şunları kontrol eder:
- ✅ Veritabanı bağlantısı
- 📊 Kullanıcı sayısı
- 📊 Şirket sayısı
- 📊 Profil sayısı
- 👤 İlk kullanıcı bilgileri

### 3. Prisma CLI Komutları

#### Migration durumunu kontrol et:
```bash
npx prisma migrate status
```

#### Schema'yı veritabanıyla karşılaştır:
```bash
npx prisma db pull
```

#### Prisma Client'ı yeniden oluştur:
```bash
npm run prisma:generate
```

### 4. Manuel Kontrol (Node.js REPL)

```bash
node
```

Sonra:
```javascript
const { prisma } = require('./lib/prisma')

// Kullanıcı sayısı
await prisma.user.count()

// Tüm kullanıcıları listele
await prisma.user.findMany()

// Belirli bir kullanıcıyı bul
await prisma.user.findUnique({
  where: { email: 'test@example.com' }
})

// Çıkış
process.exit()
```

## 🚨 Yaygın Sorunlar

### "Missing required environment variable: DATABASE_URL"
**Çözüm:** `.env` dosyasına `DATABASE_URL` ekle

### "Can't reach database server"
**Çözüm:** 
- PostgreSQL servisinin çalıştığından emin ol
- `DATABASE_URL`'deki bilgilerin doğru olduğunu kontrol et

### "Prisma Client has not been generated yet"
**Çözüm:** 
```bash
npm run prisma:generate
```

## ✅ Hızlı Kontrol Listesi

1. ✅ `.env` dosyasında `DATABASE_URL` var mı?
2. ✅ PostgreSQL servisi çalışıyor mu?
3. ✅ `npm run prisma:generate` çalıştırıldı mı?
4. ✅ Migration yapıldı mı? (`npm run prisma:migrate`)
5. ✅ `npm run prisma:test` başarılı mı?

## 🎯 En Hızlı Yöntem

```bash
# 1. Prisma Studio'yu aç (en kolay)
npm run prisma:studio

# VEYA

# 2. Test script'ini çalıştır
npm run prisma:test
```

