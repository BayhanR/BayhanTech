import { unstable_cache } from "next/cache"

export const getWeatherData = unstable_cache(
  async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,weather_code",
        { next: { revalidate: 600 } },
      )
      const data = await response.json()
      return data.current
    } catch (error) {
      console.error("Weather fetch error:", error)
      return null
    }
  },
  ["weather-data"],
  { revalidate: 600, tags: ["weather"] },
)

export const getMarketData = unstable_cache(
  async () => {
    try {
      // Placeholder - replace with actual API call
      return {
        bist100: 10453.25,
        change: 1.24,
      }
    } catch (error) {
      console.error("Market fetch error:", error)
      return null
    }
  },
  ["market-data"],
  { revalidate: 600, tags: ["market"] },
)

export const getCommodityData = unstable_cache(
  async () => {
    try {
      return {
        gold: 2847.5,
        silver: 35.42,
      }
    } catch (error) {
      console.error("Commodity fetch error:", error)
      return null
    }
  },
  ["commodity-data"],
  { revalidate: 600, tags: ["commodity"] },
)

export const getNewsData = unstable_cache(
  async () => {
    try {
      // Placeholder - replace with actual NewsAPI call
      return [
        { title: "Global Markets Rally on Economic Data", source: "Reuters" },
        { title: "Tech Sector Sees Strong Growth", source: "Bloomberg" },
        { title: "Crypto Markets Show Recovery Signs", source: "CoinDesk" },
      ]
    } catch (error) {
      console.error("News fetch error:", error)
      return []
    }
  },
  ["news-data"],
  { revalidate: 1800, tags: ["news"] },
)
