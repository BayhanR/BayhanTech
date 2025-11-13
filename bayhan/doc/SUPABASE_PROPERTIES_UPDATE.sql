-- Properties tablosuna yeni alanlar ekle
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- Properties tablosuna yeni kolonlar ekle
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('completed', 'ongoing')),
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS progress INTEGER CHECK (progress >= 0 AND progress <= 100),
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS district TEXT;

-- Mevcut kayıtlar için varsayılan değerler
UPDATE properties 
SET status = 'completed', city = 'İzmir', district = 'Merkez'
WHERE status IS NULL;

-- Index'ler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_year ON properties(year);

