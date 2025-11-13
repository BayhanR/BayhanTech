# PostgreSQL Veritabanı Kurulum Talimatları

## Yöntem 1: pgAdmin ile (Önerilen)

1. **pgAdmin'i aç**
2. **Sol tarafta "Servers" üzerine sağ tık → "Create" → "Server"**
3. **General sekmesi:**
   - Name: `BayhanTech` (istediğin ismi verebilirsin)
4. **Connection sekmesi:**
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres` (varsayılan)
   - Username: `postgres` (veya PostgreSQL kurulumunda oluşturduğun admin kullanıcı)
   - Password: PostgreSQL kurulumunda belirlediğin şifre
5. **"Save" butonuna tıkla**

6. **Oluşturulan server'a bağlan**
7. **"Databases" üzerine sağ tık → "Create" → "Database"**
8. **Database oluştur:**
   - Database: `bayhan`
   - Owner: `postgres` (veya `bayhan_user` oluşturduysan onu seç)
9. **"Save" butonuna tıkla**

10. **"bayhan" veritabanına sağ tık → "Query Tool"**
11. **`setup-database.sql` dosyasının içeriğini kopyala-yapıştır ve çalıştır (F5)**

## Yöntem 2: psql Komut Satırı ile

1. **PowerShell veya CMD'yi yönetici olarak aç**
2. **PostgreSQL'in bin klasörüne git** (örnek: `C:\Program Files\PostgreSQL\16\bin`)
3. **Şu komutları çalıştır:**

```bash
# PostgreSQL servisini başlat (eğer çalışmıyorsa)
net start postgresql-x64-16
# (veya servis adını kontrol et: Get-Service | Where-Object {$_.Name -like "*postgres*"})

# psql'e bağlan (postgres kullanıcısı ile)
psql -U postgres

# Şifre sorulacak, PostgreSQL kurulumunda belirlediğin admin şifreyi gir

# SQL komutlarını çalıştır
\i "D:\githubProjects\BayhanTech\bayhan\prisma\setup-database.sql"
```

## Yöntem 3: SQL Komutlarını Manuel Çalıştırma

1. **pgAdmin'de "postgres" veritabanına bağlan**
2. **Query Tool aç**
3. **Aşağıdaki komutları sırayla çalıştır:**

```sql
-- Kullanıcı oluştur
CREATE ROLE bayhan_user WITH LOGIN PASSWORD 'kemalpasayialicam';

-- Veritabanı oluştur
CREATE DATABASE bayhan OWNER bayhan_user;

-- bayhan veritabanına bağlan (pgAdmin'de yeni bir query tool aç ve bayhan'ı seç)
\c bayhan

-- UUID extension ekle
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE bayhan TO bayhan_user;
GRANT ALL ON SCHEMA public TO bayhan_user;
```

## PostgreSQL Servisini Başlatma

Eğer PostgreSQL servisi çalışmıyorsa:

```powershell
# Servis adını bul
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Servisi başlat (servis adını yukarıdaki komuttan öğren)
Start-Service postgresql-x64-16
# (veya bulduğun servis adı)
```

## Sorun Giderme

- **"Can't reach database server" hatası:** PostgreSQL servisi çalışmıyor olabilir, yukarıdaki komutla başlat
- **"password authentication failed" hatası:** Şifreyi yanlış girdin, `.env` dosyasındaki şifreyle eşleştiğinden emin ol
- **"database does not exist" hatası:** Veritabanını oluşturmadın, yukarıdaki adımları takip et

