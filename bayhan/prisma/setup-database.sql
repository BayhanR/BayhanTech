-- PostgreSQL Veritabanı Kurulum Scripti
-- Bu dosyayı pgAdmin'de veya psql'de çalıştır

-- 1. Kullanıcı oluştur (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'bayhan_user') THEN
    CREATE ROLE bayhan_user WITH LOGIN PASSWORD 'kemalpasayialicam';
  END IF;
END
$$;

-- 2. Veritabanı oluştur (eğer yoksa)
-- NOT: Bu komutu postgres veritabanında çalıştır, sonra bayhan veritabanına geç
CREATE DATABASE bayhan OWNER bayhan_user;

-- 3. Veritabanına bağlan ve extension'ı ekle
-- NOT: pgAdmin'de bayhan veritabanını seçip yeni bir Query Tool aç
-- veya psql'de: \c bayhan

-- UUID extension'ı ekle
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Kullanıcıya yetki ver (bayhan veritabanında çalıştır)
GRANT ALL ON SCHEMA public TO bayhan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bayhan_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bayhan_user;

-- Başarılı!
SELECT 'Veritabanı kurulumu tamamlandı!' AS status;

