# PostgreSQL Hızlı Kurulum (Windows)

## Adım 1: PostgreSQL İndir ve Kur

1. **https://www.postgresql.org/download/windows/** adresine git
2. **"Download the installer"** butonuna tıkla
3. **PostgreSQL 16.x** (en son sürüm) indir
4. İndirilen `.exe` dosyasını **YÖNETİCİ OLARAK** çalıştır

## Adım 2: Kurulum Ayarları

1. **Welcome:** Next
2. **Installation Directory:** Varsayılan (C:\Program Files\PostgreSQL\16) → Next
3. **Select Components:** Hepsi seçili olsun → Next
4. **Data Directory:** Varsayılan → Next
5. **Password:** 
   - **ÖNEMLİ:** Güçlü bir şifre belirle (unutma!)
   - Örnek: `PostgresAdmin123!` (kendi şifreni belirle)
   - Bu şifreyi `.env` dosyasında kullanacaksın
6. **Port:** `5432` (varsayılan) → Next
7. **Advanced Options:** Varsayılan → Next
8. **Pre Installation Summary:** Next
9. **Ready to Install:** Next
10. Kurulum tamamlanınca **"Finish"**

## Adım 3: Servisi Kontrol Et

Kurulum sonrası PowerShell'de:

```powershell
# Servis adını bul
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Servisi başlat (yukarıdaki komuttan gelen servis adını kullan)
Start-Service postgresql-x64-16
# (veya farklı bir isim olabilir, yukarıdaki komuttan öğren)

# Durumu kontrol et
Get-Service postgresql-x64-16
```

## Adım 4: pgAdmin ile Bağlan

1. **pgAdmin'i aç** (PostgreSQL kurulumuyla birlikte gelir)
2. **İlk açılışta master password sorar** → pgAdmin için bir şifre belirle
3. **Sol tarafta "Servers" üzerine sağ tık → "Create" → "Server"**
4. **General:** Name: `BayhanTech`
5. **Connection:**
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: PostgreSQL kurulumunda belirlediğin şifre (Adım 2'deki)
6. **"Save"**

## Adım 5: Veritabanını Oluştur

1. Oluşturduğun server'da **"Databases" üzerine sağ tık → "Create" → "Database"**
2. **Database:** `bayhan`
3. **Owner:** `postgres`
4. **"Save"**

## Adım 6: SQL Scriptini Çalıştır

1. **"bayhan" veritabanına sağ tık → "Query Tool"**
2. `prisma/setup-database.sql` dosyasını aç, içeriğini kopyala
3. Query Tool'a yapıştır ve **F5** ile çalıştır

## Adım 7: .env Dosyasını Güncelle

`.env` dosyasında şifreyi güncelle:

```env
DATABASE_URL="postgresql://bayhan_user:kemalpasayialicam@localhost:5432/bayhan?schema=public"
```

Eğer `bayhan_user` oluşturmadıysan, önce `postgres` kullanıcısıyla bağlan:

```env
DATABASE_URL="postgresql://postgres:POSTGRES_KURULUM_SIFREN@localhost:5432/bayhan?schema=public"
```

## Sorun Giderme

- **Servis bulunamıyor:** PostgreSQL kurulu değil, yukarıdaki adımları takip et
- **Bağlantı hatası:** Servisi başlat: `Start-Service postgresql-x64-16`
- **Şifre hatası:** PostgreSQL kurulumunda belirlediğin şifreyi kullan

