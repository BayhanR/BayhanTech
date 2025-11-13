"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string
}

export function ProductGallery({ userId, products: initialProducts }: { userId: string; products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [images, setImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const productIds = products.map((p) => p.id)
        if (productIds.length === 0) {
          setLoading(false)
          return
        }

        // Her product için resimleri getir
        const imagePromises = productIds.map(async (productId) => {
          const response = await fetch(`/api/products/images?productId=${productId}`)
          if (response.ok) {
            const urls = await response.json()
            return { productId, urls }
          }
          return { productId, urls: [] }
        })

        const results = await Promise.all(imagePromises)
        const groupedImages: Record<string, string[]> = {}
        results.forEach(({ productId, urls }) => {
          groupedImages[productId] = urls
        })
        setImages(groupedImages)
      } catch (error) {
        console.error('Failed to fetch images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [products])

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-border/100 transition-colors"
        >
          <div className="h-48 bg-muted flex items-center justify-center">
            {images[product.id]?.length > 0 ? (
              <img
                src={images[product.id][0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">No images</span>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2">{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href={`/portal/dashboard/${product.id}/product`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Fotoğrafları Yönet
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(product.id)}
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
