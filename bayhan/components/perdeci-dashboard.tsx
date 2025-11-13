"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Plus } from "lucide-react"
import { PerdeciProductForm } from "@/components/perdeci-product-form"
import { ProductGallery } from "@/components/product-gallery"

interface Product {
  id: string
  name: string
  description: string
}

export function PerdecDashboard({ userId }: { userId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [userId])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-accent" />
          Ürün Galerisi
        </h1>
        <p className="text-muted-foreground">Perde ve kumaş ürünlerinizi sergileyin</p>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList>
          <TabsTrigger value="gallery">Ürünlerim</TabsTrigger>
          <TabsTrigger value="add">Fotoğraf Yükle</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          {loading ? (
            <p className="text-muted-foreground">Yükleniyor...</p>
          ) : products.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center py-12">
              <p className="text-muted-foreground mb-4">Henüz ürün yok</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                İlk Ürününüzü Ekleyin
              </Button>
            </Card>
          ) : (
            <ProductGallery userId={userId} products={products} />
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <PerdeciProductForm userId={userId} onSuccess={() => setShowForm(false)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
