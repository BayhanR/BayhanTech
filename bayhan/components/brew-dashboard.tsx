"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus } from "lucide-react"
import { BrewPropertyForm } from "@/components/brew-property-form"
import { PropertyGrid } from "@/components/property-gallery"

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

export function BrewDashboard({ userId }: { userId: string }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [userId])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-accent" />
          Emlak İlanları
        </h1>
        <p className="text-muted-foreground">Emlak ilanlarınızı ve fotoğraflarınızı yönetin</p>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList>
          <TabsTrigger value="listings">İlanlarım</TabsTrigger>
          <TabsTrigger value="add">İlan Ekle</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {loading ? (
            <p className="text-muted-foreground">Yükleniyor...</p>
          ) : properties.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center py-12">
              <p className="text-muted-foreground mb-4">Henüz emlak ilanı yok</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                İlk İlanınızı Oluşturun
              </Button>
            </Card>
          ) : (
            <PropertyGrid userId={userId} properties={properties} />
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <BrewPropertyForm userId={userId} onSuccess={() => setShowForm(false)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
