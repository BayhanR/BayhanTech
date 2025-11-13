"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Property {
  id: string
  title: string
  description: string
  status?: "completed" | "ongoing"
  year?: number
  progress?: number
  city?: string
  district?: string
}

export function PropertyGrid({ userId, properties: initialProperties }: { userId: string; properties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties)
  const [images, setImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const propertyIds = properties.map((p) => p.id)
        if (propertyIds.length === 0) {
          setLoading(false)
          return
        }

        // Her property için resimleri getir
        const imagePromises = propertyIds.map(async (propertyId) => {
          const response = await fetch(`/api/properties/images?propertyId=${propertyId}`)
          if (response.ok) {
            const urls = await response.json()
            return { propertyId, urls }
          }
          return { propertyId, urls: [] }
        })

        const results = await Promise.all(imagePromises)
        const groupedImages: Record<string, string[]> = {}
        results.forEach(({ propertyId, urls }) => {
          groupedImages[propertyId] = urls
        })
        setImages(groupedImages)
      } catch (error) {
        console.error('Failed to fetch images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [properties])

  const handleDelete = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== propertyId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-border/100 transition-colors"
        >
          <div className="h-48 bg-muted flex items-center justify-center">
            {images[property.id]?.length > 0 ? (
              <img
                src={images[property.id][0] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Fotoğraf yok</span>
              </div>
            )}
          </div>
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="line-clamp-1 flex-1">{property.title}</CardTitle>
              {property.status && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === "completed"
                      ? "bg-green-500/20 text-green-600"
                      : "bg-blue-500/20 text-blue-600"
                  }`}
                >
                  {property.status === "completed" ? "Biten" : "Devam Eden"}
                </span>
              )}
            </div>
            <CardDescription className="line-clamp-2">{property.description}</CardDescription>
            {(property.city || property.district) && (
              <p className="text-xs text-muted-foreground mt-2">
                📍 {property.city} {property.district && `/ ${property.district}`}
              </p>
            )}
            {property.status === "completed" && property.year && (
              <p className="text-xs text-muted-foreground">📅 {property.year}</p>
            )}
            {property.status === "ongoing" && property.progress !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">İlerleme</span>
                  <span className="font-medium">%{property.progress}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${property.progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href={`/portal/dashboard/${property.id}/property`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Fotoğrafları Yönet
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(property.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
