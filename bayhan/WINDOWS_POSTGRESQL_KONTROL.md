# Windows'ta PostgreSQL Kontrol ve Kurulum Rehberi

## 🔍 PostgreSQL Kontrol Yöntemleri

### 1. Servis Kontrolü (PowerShell)

```powershell
# PostgreSQL servislerini listele
Get-Service -Name "*postgresql*"

# Tüm servisleri listele ve postgres ara
Get-Service | Where-Object {$_.DisplayName -like "*postgres*"}
```

**Beklenen çıktı:**
```
Status   Name               DisplayName
------   ----               -----------
Running  postgresql-x64-16  PostgreSQL Database Server 16
```

### 2. Port Kontrolü (5432)

```powershell
# Port 5432'nin açık olup olmadığını kontrol et
Test-NetConnection -ComputerName localhost -Port 5432

# Veya netstat ile
netstat -an | findstr "5432"
```

**Beklenen çıktı:** Port açıksa `True` veya `LISTENING` durumu

### 3. psql Komutu Kontrolü

```powershell
# psql komutunun kurulu olup olmadığını kontrol et
Get-Command psql -ErrorAction SilentlyContinue

# Veya direkt çalıştır
psql --version
```

### 4. PostgreSQL Kurulum Klasörü Kontrolü

```powershell
# Varsayılan kurulum yerleri
Test-Path "C:\Program Files\PostgreSQL"
Test-Path "C:\Program Files (x86)\PostgreSQL"
```

## 📦 PostgreSQL Kurulumu (Windows)

### Yöntem 1: Resmi Installer (Önerilen)

1. **İndir:**
   - https://www.postgresql.org/download/windows/
   - "Download the installer" tıkla
   - En son sürümü indir (16.x önerilir)

2. **Kur:**
   - İndirilen `.exe` dosyasını çalıştır
   - Kurulum sırasında:
     - **Port:** 5432 (varsayılan)
     - **Superuser (postgres) şifresi:** Güçlü bir şifre belirle (unutma!)
     - **Locale:** Turkish, Turkey (veya istediğin)

3. **Kurulum Sonrası:**
   - Stack Builder'ı atla (gerekmez)
   - pgAdmin 4'ü kur (opsiyonel, görsel arayüz)

### Yöntem 2: Chocolatey (Hızlı)

```powershell
# Chocolatey kurulu değilse önce kur
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# PostgreSQL kur
choco install postgresql16 -y
```

### Yöntem 3: Winget (Windows 11/10)

```powershell
winget install PostgreSQL.PostgreSQL
```

## ✅ Kurulum Sonrası Kontrol

### 1. Servisi Başlat

```powershell
# Servis adını bul
Get-Service -Name "*postgresql*" | Select-Object Name

# Servisi başlat (servis adı farklı olabilir)
Start-Service postgresql-x64-16
# veya
net start postgresql-x64-16
```

### 2. Bağlantı Testi

```powershell
# psql ile bağlan (postgres kullanıcısı ile)
psql -U postgres -h localhost

# Şifre soracak, kurulum sırasında belirlediğin şifreyi gir
```

### 3. Veritabanı Oluştur

```sql
-- psql içinde çalıştır
CREATE DATABASE bayhan;
CREATE USER bayhan_user WITH PASSWORD 'kemalpasayialicam';
GRANT ALL PRIVILEGES ON DATABASE bayhan TO bayhan_user;
\q
```

## 🔧 Servis Yönetimi

### Servisi Başlat/Durdur/Yeniden Başlat

```powershell
# Servis adını bul
$serviceName = (Get-Service -Name "*postgresql*").Name

# Başlat
Start-Service $serviceName

# Durdur
Stop-Service $serviceName

# Yeniden başlat
Restart-Service $serviceName

# Durum kontrolü
Get-Service $serviceName
```

### Otomatik Başlatma Ayarla

```powershell
$serviceName = (Get-Service -Name "*postgresql*").Name
Set-Service -Name $serviceName -StartupType Automatic
```

## 🚨 Sorun Giderme

### "psql komutu bulunamadı"

**Çözüm:** PATH'e ekle

```powershell
# PostgreSQL bin klasörünü bul (genellikle)
$pgPath = "C:\Program Files\PostgreSQL\16\bin"

# PATH'e ekle (geçici)
$env:Path += ";$pgPath"

# Kalıcı yapmak için
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$pgPath", "Machine")
```

### "Port 5432 zaten kullanılıyor"

**Çözüm:** Başka bir uygulama portu kullanıyor olabilir

```powershell
# Portu kullanan process'i bul
netstat -ano | findstr "5432"

# Process ID'yi al ve durdur
taskkill /PID <PID_NUMARASI> /F
```

### "Bağlantı reddedildi"

**Çözüm:** 
1. PostgreSQL servisinin çalıştığından emin ol
2. `pg_hba.conf` dosyasını kontrol et (genellikle `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`)
3. Firewall'u kontrol et

## 📝 Hızlı Test Script'i

Aşağıdaki PowerShell script'ini çalıştırarak tüm kontrolleri yap:

```powershell
Write-Host "=== PostgreSQL Kontrol ===" -ForegroundColor Cyan

# 1. Servis kontrolü
Write-Host "`n1. Servis Kontrolü:" -ForegroundColor Yellow
$service = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "   ✅ Servis bulundu: $($service.Name)" -ForegroundColor Green
    Write-Host "   Durum: $($service.Status)" -ForegroundColor $(if ($service.Status -eq 'Running') {'Green'} else {'Red'})
} else {
    Write-Host "   ❌ PostgreSQL servisi bulunamadı" -ForegroundColor Red
}

# 2. Port kontrolü
Write-Host "`n2. Port Kontrolü (5432):" -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($portTest) {
    Write-Host "   ✅ Port 5432 açık" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 5432 kapalı veya erişilemiyor" -ForegroundColor Red
}

# 3. psql kontrolü
Write-Host "`n3. psql Komutu:" -ForegroundColor Yellow
$psql = Get-Command psql -ErrorAction SilentlyContinue
if ($psql) {
    Write-Host "   ✅ psql bulundu: $($psql.Source)" -ForegroundColor Green
    $version = & psql --version 2>&1
    Write-Host "   Versiyon: $version" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ psql komutu bulunamadı" -ForegroundColor Red
}

# 4. Kurulum klasörü kontrolü
Write-Host "`n4. Kurulum Klasörü:" -ForegroundColor Yellow
$paths = @(
    "C:\Program Files\PostgreSQL",
    "C:\Program Files (x86)\PostgreSQL"
)
$found = $false
foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "   ✅ Bulundu: $path" -ForegroundColor Green
        $found = $true
    }
}
if (-not $found) {
    Write-Host "   ❌ PostgreSQL kurulum klasörü bulunamadı" -ForegroundColor Red
}

Write-Host "`n=== Kontrol Tamamlandı ===" -ForegroundColor Cyan
```

## 🎯 Sonraki Adımlar

PostgreSQL kurulduktan ve çalıştıktan sonra:

1. ✅ `.env` dosyasında `DATABASE_URL` ayarla
2. ✅ `npm run prisma:generate` çalıştır
3. ✅ `npm run prisma:migrate` çalıştır
4. ✅ `npm run prisma:test` ile bağlantıyı test et


