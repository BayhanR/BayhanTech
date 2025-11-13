# PostgreSQL Kurulum ve Başlatma Talimatları

## PostgreSQL Kurulu mu Kontrol Et

### Yöntem 1: Programlar ve Özellikler
1. Windows tuşu + R → `appwiz.cpl` yaz → Enter
2. "PostgreSQL" araması yap
3. Eğer görünüyorsa kurulu demektir

### Yöntem 2: PowerShell
```powershell
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*PostgreSQL*"} | Select-Object DisplayName, DisplayVersion
```

## PostgreSQL Kurulu Değilse - Kurulum

### Adım 1: PostgreSQL İndir
1. https://www.postgresql.org/download/windows/ adresine git
2. "Download the installer" butonuna tıkla
3. En son sürümü indir (örnek: PostgreSQL 16.x)

### Adım 2: Kurulum
1. İndirilen `.exe` dosyasını çalıştır
2. **Installation Directory:** Varsayılan bırak (C:\Program Files\PostgreSQL\16)
3. **Data Directory:** Varsayılan bırak
4. **Password:** Güçlü bir şifre belirle (unutma, pgAdmin'de kullanacaksın!)
5. **Port:** 5432 (varsayılan)
6. **Advanced Options:** Varsayılan bırak
7. **Pre Installation Summary:** "Next"
8. **Ready to Install:** "Next"
9. Kurulum tamamlanınca "Finish"

### Adım 3: Servisi Başlat
Kurulum sonrası servis otomatik başlamalı, ama kontrol et:

```powershell
# PowerShell'i YÖNETİCİ olarak aç
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Servis adını görünce (örnek: postgresql-x64-16)
Start-Service postgresql-x64-16
```

## PostgreSQL Kurulu Ama Servis Çalışmıyorsa

### Servisi Başlat

```powershell
# PowerShell'i YÖNETİCİ olarak aç

# 1. Servis adını bul
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# 2. Servisi başlat (yukarıdaki komuttan gelen servis adını kullan)
Start-Service postgresql-x64-16
# (veya bulduğun servis adı)

# 3. Servis durumunu kontrol et
Get-Service postgresql-x64-16
```

### Servis Başlamıyorsa - Manuel Başlatma

1. **Windows tuşu + R → `services.msc` → Enter**
2. **"PostgreSQL" servisini bul**
3. **Sağ tık → "Start"**
4. **Eğer hata veriyorsa:**
   - Sağ tık → "Properties"
   - "Log On" sekmesi → "This account" seç
   - "Browse" → "Advanced" → "Find Now" → "NETWORK SERVICE" seç → "OK"
   - Şifre boş bırak → "OK"
   - Tekrar başlatmayı dene

## Port Kontrolü

PostgreSQL'in 5432 portunda dinlediğinden emin ol:

```powershell
Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
```

Eğer boşsa, PostgreSQL çalışmıyor demektir.

## pgAdmin ile Bağlantı

1. **pgAdmin'i aç** (PostgreSQL kurulumuyla birlikte gelir)
2. **İlk açılışta master password sorar** (pgAdmin için, PostgreSQL şifresi değil)
3. **Sol tarafta "Servers" üzerine sağ tık → "Create" → "Server"**
4. **General:** Name: `BayhanTech`
5. **Connection:**
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: PostgreSQL kurulumunda belirlediğin şifre
6. **"Save"**

## Sorun Giderme

### "Connection timeout" Hatası
- PostgreSQL servisi çalışmıyor → Servisi başlat
- Firewall engelliyor → Windows Firewall'da PostgreSQL'e izin ver
- Port farklı → `postgresql.conf` dosyasında port'u kontrol et

### "Password authentication failed" Hatası
- Şifreyi yanlış girdin → PostgreSQL kurulumunda belirlediğin şifreyi kullan

### Servis Başlamıyor
- Event Viewer'da hata loglarını kontrol et
- PostgreSQL data klasöründe izin sorunu olabilir
- Antivirus engelliyor olabilir

