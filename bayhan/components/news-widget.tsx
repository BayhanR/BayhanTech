"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"

interface NewsItem {
  title: string
  source: string
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Türk haber sitelerinden örnek haberler
        // Gerçek API'ye bağlanabilir: https://api.haberler.com veya benzeri
        const turkishNews = [
          { title: "BIST 100 Endeksi Yükselişe Geçti", source: "Hürriyet" },
          { title: "Teknoloji Sektöründe Büyüme Devam Ediyor", source: "Milliyet" },
          { title: "Dijital Dönüşüm Projeleri Hızlanıyor", source: "Sabah" },
          { title: "E-Ticaret Sektöründe Rekor Büyüme", source: "NTV" },
          { title: "Yazılım Geliştirme Pazarı Genişliyor", source: "CNN Türk" },
        ]
        // Rastgele 3 haber seç
        const shuffled = turkishNews.sort(() => 0.5 - Math.random())
        setNews(shuffled.slice(0, 3))
      } catch (error) {
        console.error("News fetch error:", error)
        // Fallback haberler
        setNews([
          { title: "BIST 100 Endeksi Yükselişe Geçti", source: "Hürriyet" },
          { title: "Teknoloji Sektöründe Büyüme Devam Ediyor", source: "Milliyet" },
          { title: "Dijital Dönüşüm Projeleri Hızlanıyor", source: "Sabah" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
    // Her 30 dakikada bir güncelle
    const interval = setInterval(fetchNews, 1800000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-accent" />
          Son Haberler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Yükleniyor...</p>
        ) : news.length > 0 ? (
          <div className="space-y-2">
            {news.slice(0, 3).map((item, idx) => (
              <div key={idx} className="text-xs">
                <p className="font-medium line-clamp-2">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.source}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-destructive">Haberler yüklenemedi</p>
        )}
      </CardContent>
    </Card>
  )
}
