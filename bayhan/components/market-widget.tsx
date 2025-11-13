"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface MarketData {
  bist100: number
  change: number
}

export function MarketWidget() {
  const [market, setMarket] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        // BIST100 için gerçek API (örnek: Alpha Vantage veya alternatif)
        // Şimdilik mock data ama gerçek API'ye bağlanabilir
        // Örnek: https://api.borsaistanbul.com/endeksler/bist100 (eğer varsa)
        
        // Simüle edilmiş değişken veri (gerçek API'ye bağlanınca bu kaldırılacak)
        const baseValue = 10453.25
        const randomChange = (Math.random() * 3 - 1.5).toFixed(2) // -1.5 ile +1.5 arası
        const newValue = (baseValue + parseFloat(randomChange) * 10).toFixed(2)
        
          setMarket({
          bist100: parseFloat(newValue),
          change: parseFloat(randomChange),
          })
      } catch (error) {
        console.error("Market fetch error:", error)
        // Fallback data
        setMarket({
          bist100: 10453.25,
          change: 1.24,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMarket()
    // Her 30 saniyede bir güncelle (gerçek API için)
    const interval = setInterval(fetchMarket, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          BIST 100
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Yükleniyor...</p>
        ) : market ? (
          <div className="space-y-1">
            <p className="text-2xl font-bold">{market.bist100.toFixed(2)}</p>
            <p className={`text-xs ${market.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {market.change >= 0 ? "+" : ""}
              {market.change.toFixed(2)}%
            </p>
          </div>
        ) : (
          <p className="text-xs text-destructive">Unable to load</p>
        )}
      </CardContent>
    </Card>
  )
}
