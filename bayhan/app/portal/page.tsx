"use client"

import { useEffect, useState } from "react"
import { PortalHeader } from "@/components/portal-header"
import { WeatherWidget } from "@/components/weather-widget"
import { MarketWidget } from "@/components/market-widget"
import { CommodityWidget } from "@/components/commodity-widget"
import { NewsWidget } from "@/components/news-widget"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to get user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <PortalHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            <span className="text-accent">bayhan.tech</span> Portal'a Hoş Geldiniz
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Emlak ilanları ve ürün galerileri için profesyonel portal
          </p>
          <p className="text-muted-foreground">
            Ana sayfadaki Portal section'dan veya portal-page'den giriş yapabilirsiniz.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <PortalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Portal Kontrol Paneli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <WeatherWidget />
            <MarketWidget />
            <CommodityWidget />
            <NewsWidget />
          </div>
        </div>
        <div className="mt-12">
          <Link href="/portal/dashboard">
            <Button size="lg" className="px-8">
              Kontrol Paneline Git
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
