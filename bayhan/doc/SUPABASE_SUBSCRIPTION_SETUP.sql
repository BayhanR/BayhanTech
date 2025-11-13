-- Subscription Tablosu Oluşturma
-- Bu script'i Supabase SQL Editor'de çalıştırın

-- 1. Subscriptions tablosunu oluştur
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- 3. RLS (Row Level Security) Politikaları
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi subscription'larını görebilir
CREATE POLICY "Users can view own subscription" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Kullanıcılar kendi subscription'larını güncelleyemez (sadece admin)
-- Admin işlemleri için service_role key kullanılmalı

-- 4. Mevcut kullanıcılar için örnek subscription oluştur (1 yıl)
-- NOT: Bu sadece örnek, gerçek kullanıcılar için manuel oluşturulmalı
-- INSERT INTO subscriptions (user_id, expires_at)
-- SELECT id, NOW() + INTERVAL '1 year'
-- FROM auth.users
-- WHERE id NOT IN (SELECT user_id FROM subscriptions);

-- 5. Trigger: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at_trigger
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_subscriptions_updated_at();

