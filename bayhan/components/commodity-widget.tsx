"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CommodityData {
  gold: number
  silver: number
}

export function CommodityWidget() {
  const [commodities, setCommodities] = useState<CommodityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        // Altın ve Gümüş fiyatları için gerçek API
        // Örnek: https://api.metals.live/v1/spot (eğer varsa)
        // Şimdilik simüle edilmiş değişken veri
        
        const baseGold = 2847.5
        const baseSilver = 35.42
        const goldChange = (Math.random() * 20 - 10).toFixed(2) // -10 ile +10 arası
        const silverChange = (Math.random() * 2 - 1).toFixed(2) // -1 ile +1 arası
        
        setCommodities({
          gold: parseFloat((baseGold + parseFloat(goldChange)).toFixed(2)),
          silver: parseFloat((baseSilver + parseFloat(silverChange)).toFixed(2)),
        })
      } catch (error) {
        console.error("Commodity fetch error:", error)
        // Fallback data
        setCommodities({
          gold: 2847.5,
          silver: 35.42,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCommodities()
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchCommodities, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          💰 Emtia Fiyatları
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Yükleniyor...</p>
        ) : commodities ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-md bg-yellow-500/10">
              <span className="text-muted-foreground font-medium">Altın (oz)</span>
              <span className="font-bold text-yellow-600">${commodities.gold.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-gray-400/10">
              <span className="text-muted-foreground font-medium">Gümüş (oz)</span>
              <span className="font-bold text-gray-600">${commodities.silver.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-destructive">Unable to load</p>
        )}
      </CardContent>
    </Card>
  )
}
