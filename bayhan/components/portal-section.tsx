"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, TrendingUp, Bell, MapPin } from "lucide-react"

export default function PortalSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [weather, setWeather] = useState({ temp: "24°C", condition: "Güneşli" })
  const [stocks, setStocks] = useState({ change: "+2.5%", value: "1,245" })

  useEffect(() => {
    // Placeholder for API calls
    // In real implementation, fetch from weather and stock APIs
  }, [])

  return (
    <section id="portal" ref={ref} className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Portal</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Güncel bilgilere hızlı erişim</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Cloud className="h-5 w-5" />
                  Hava Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-foreground">{weather.temp}</div>
                    <div className="text-sm text-muted-foreground mt-1">{weather.condition}</div>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-4 text-xs text-muted-foreground">İstanbul, Türkiye</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  Borsa Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-foreground">{stocks.value}</div>
                    <div className="text-sm text-green-400 mt-1">{stocks.change}</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-4 text-xs text-muted-foreground">BIST 100 Endeksi</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Bell className="h-5 w-5" />
                  Bildirimler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-400 mt-2" />
                    <div>
                      <div className="text-sm text-foreground">Yeni proje eklendi</div>
                      <div className="text-xs text-muted-foreground">2 saat önce</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-400 mt-2" />
                    <div>
                      <div className="text-sm text-foreground">Portfolio güncellendi</div>
                      <div className="text-xs text-muted-foreground">1 gün önce</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
