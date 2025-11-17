"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { PortalHeader } from "@/components/portal-header"
import { WeatherWidget } from "@/components/weather-widget"
import { MarketWidget } from "@/components/market-widget"
import { CommodityWidget } from "@/components/commodity-widget"
import { NewsWidget } from "@/components/news-widget"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const user = session?.user

  // Portal sayfalarında body ve html overflow'unu aç
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    
    return () => {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
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
      <main className="h-screen bg-background overflow-y-scroll overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
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
    <main className="h-screen bg-background overflow-y-scroll overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
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
