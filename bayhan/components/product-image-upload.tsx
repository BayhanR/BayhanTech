"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Loader } from "lucide-react"

interface ProductImageUploadProps {
  productId: string
  userId: string
  onSuccess?: () => void
}

export function ProductImageUpload({ productId, userId, onSuccess }: ProductImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mevcut resimleri yükle
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/products/images?productId=${productId}`)
        if (response.ok) {
          const urls = await response.json()
          setImages(urls)
        } else if (response.status === 403) {
          setError("Bu ürüne erişim yetkiniz yok")
        }
      } catch (err) {
        console.error('Failed to fetch images:', err)
        setError("Fotoğraflar yüklenirken bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [productId])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    setError(null)

    try {
      const uploadedImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'product')
        formData.append('itemId', productId)

        const response = await fetch('/portal/api/images/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        uploadedImages.push(data.url)
      }

      setImages([...images, ...uploadedImages])
      if (fileInputRef.current) fileInputRef.current.value = ""
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageUrl: string) => {
    try {
      const response = await fetch('/portal/api/images/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          type: 'product',
        }),
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setImages(images.filter((img) => img !== imageUrl))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Silme başarısız oldu")
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Ürün Fotoğrafları</CardTitle>
        <CardDescription>Ürünlerinizin fotoğraflarını yükleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-medium">Yüklemek için tıklayın veya sürükleyip bırakın</p>
          <p className="text-sm text-muted-foreground">PNG, JPG, GIF (Maksimum 10MB)</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            Fotoğraflar yükleniyor...
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image} className="relative group rounded-lg overflow-hidden">
                <img src={image || "/placeholder.svg"} alt="Ürün" className="w-full h-32 object-cover" />
                <button
                  onClick={() => handleDelete(image)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">Henüz fotoğraf yok.</p>
        )}

        {uploading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader className="w-4 h-4 animate-spin" />
            Yükleniyor...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
