import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { PortalHeader } from "@/components/portal-header"
import { BrewDashboard } from "@/components/brew-dashboard"
import { PerdecDashboard } from "@/components/perdeci-dashboard"
import { WeatherWidget } from "@/components/weather-widget"
import { MarketWidget } from "@/components/market-widget"
import { CommodityWidget } from "@/components/commodity-widget"
import { NewsWidget } from "@/components/news-widget"
import { SupportTicketForm } from "@/components/support-ticket-form"
import { SubscriptionWidget } from "@/components/subscription-widget"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/portal")
  }

  // Profile kontrolü
  if (!user.profile) {
    redirect("/portal")
  }

  const category = user.profile.company.category

  return (
    <main className="min-h-screen bg-background">
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
