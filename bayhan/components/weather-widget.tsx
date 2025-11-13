"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun } from "lucide-react"

interface WeatherData {
  temp: number
  condition: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,weather_code",
        )
        const data = await response.json()
        const current = data.current
        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: current.weather_code === 0 ? "Clear" : "Cloudy",
        })
      } catch (error) {
        console.error("Weather fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sun className="w-4 h-4 text-accent" />
          Hava Durumu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-sm">Yükleniyor...</p>
        ) : weather ? (
          <div className="space-y-1">
            <p className="text-2xl font-bold">{weather.temp}°C</p>
            <p className="text-xs text-muted-foreground">{weather.condition}</p>
          </div>
        ) : (
          <p className="text-xs text-destructive">Unable to load</p>
        )}
      </CardContent>
    </Card>
  )
}
