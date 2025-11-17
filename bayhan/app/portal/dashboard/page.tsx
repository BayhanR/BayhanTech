"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PortalHeader } from "@/components/portal-header"
import { BrewDashboard } from "@/components/brew-dashboard"
import { PerdecDashboard } from "@/components/perdeci-dashboard"
import { WeatherWidget } from "@/components/weather-widget"
import { MarketWidget } from "@/components/market-widget"
import { CommodityWidget } from "@/components/commodity-widget"
import { NewsWidget } from "@/components/news-widget"
import { SupportTicketForm } from "@/components/support-ticket-form"
import { SubscriptionWidget } from "@/components/subscription-widget"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Portal sayfalarında body ve html overflow'unu aç
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    
    return () => {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
  }, [])

  // Session kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/portal")
  }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user
  const profile = (user as any)?.profile

  if (!profile) {
    return null
  }

  const category = profile.company?.category

  return (
    <main className="h-screen bg-background overflow-y-scroll overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
      <PortalHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Widget'lar - Üstte */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Kontrol Paneli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <SubscriptionWidget />
            <WeatherWidget />
            <MarketWidget />
            <CommodityWidget />
            <NewsWidget />
          </div>
        </div>

        {/* Ana Dashboard İçeriği */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
        {category === "brew" ? (
          <BrewDashboard userId={user.id} />
        ) : (
          <PerdecDashboard userId={user.id} />
        )}
          </div>

          {/* Destek Ticket Formu */}
          <div className="lg:col-span-1">
            <SupportTicketForm />
          </div>
        </div>
      </div>
    </main>
  )
}
