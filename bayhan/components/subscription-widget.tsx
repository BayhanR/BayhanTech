"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, AlertCircle, CheckCircle } from "lucide-react"

interface SubscriptionData {
  expires_at: string | null
  days_remaining: number | null
  is_active: boolean
}

export function SubscriptionWidget() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions')
        if (response.ok) {
          const data = await response.json()
          if (data.subscription) {
            setSubscription({
              expires_at: data.subscription.expiresAt,
              days_remaining: data.subscription.daysRemaining,
              is_active: data.subscription.isActive,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Abonelik Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Yükleniyor...</p>
        </CardContent>
      </Card>
    )
  }

  if (!subscription || !subscription.expires_at) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Abonelik Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">Abonelik bilgisi bulunamadı</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isExpiringSoon = subscription.days_remaining !== null && subscription.days_remaining <= 30 && subscription.days_remaining > 0
  const isExpired = subscription.days_remaining !== null && subscription.days_remaining <= 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent" />
          Server Kira Durumu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isExpired ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Abonelik Süresi Doldu</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription.expires_at
                ? new Date(subscription.expires_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Bilinmiyor"}
            </p>
          </div>
        ) : isExpiringSoon ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">
                {subscription.days_remaining} gün kaldı
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Bitiş:{" "}
              {subscription.expires_at
                ? new Date(subscription.expires_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Bilinmiyor"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <p className="text-sm font-medium">
                {subscription.days_remaining !== null
                  ? `${subscription.days_remaining} gün kaldı`
                  : "Aktif"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Bitiş:{" "}
              {subscription.expires_at
                ? new Date(subscription.expires_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Bilinmiyor"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

