"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type PropertyStatus = "completed" | "ongoing"

export function BrewPropertyForm({ userId, onSuccess }: { userId: string; onSuccess: () => void }) {
  const [status, setStatus] = useState<PropertyStatus>("completed")
  const [year, setYear] = useState("")
  const [progress, setProgress] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    setSelectedFiles((prev) => [...prev, ...fileArray])
    setError(null)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city || !district) {
      setError("Lütfen il ve ilçe bilgilerini girin")
      return
    }

    if (status === "completed" && !year) {
      setError("Biten inşaat için yıl bilgisi gereklidir")
      return
    }

    if (status === "ongoing" && !progress) {
      setError("Devam eden inşaat için tamamlanma yüzdesi gereklidir")
      return
    }

    if (selectedFiles.length === 0) {
      setError("Lütfen en az bir fotoğraf seçin")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('status', status)
      if (year) formData.append('year', year)
      if (progress) formData.append('progress', progress)
      formData.append('city', city)
      formData.append('district', district)
      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Kayıt başarısız oldu')
      }

      // Form'u temizle
      setStatus("completed")
      setYear("")
      setProgress("")
      setCity("")
      setDistrict("")
      setSelectedFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ""
      onSuccess()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız oldu")
    } finally {
      setUploading(false)
    }
  }

  // Yıl seçenekleri (son 20 yıl)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>İnşaat Projesi Ekle</CardTitle>
        <CardDescription>
          Biten veya devam eden inşaat projelerinizi ekleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Durum Seçimi */}
          <div className="space-y-2">
            <Label htmlFor="status">Proje Durumu</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as PropertyStatus)}>
              <SelectTrigger id="status" className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Biten İnşaat</SelectItem>
                <SelectItem value="ongoing">Devam Eden İnşaat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Biten İnşaat için Yıl */}
          {status === "completed" && (
            <div className="space-y-2">
              <Label htmlFor="year">Tamamlanma Yılı *</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year" className="bg-background/50">
                  <SelectValue placeholder="Yıl seçin" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Devam Eden İnşaat için İlerleme */}
          {status === "ongoing" && (
            <div className="space-y-2">
              <Label htmlFor="progress">Tamamlanma Yüzdesi (%) *</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                placeholder="Örn: 75"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
          )}

          {/* İl */}
          <div className="space-y-2">
            <Label htmlFor="city">İl *</Label>
            <Input
              id="city"
              placeholder="Örn: İstanbul"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* İlçe */}
          <div className="space-y-2">
            <Label htmlFor="district">İlçe *</Label>
            <Input
              id="district"
              placeholder="Örn: Kadıköy"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* Fotoğraf Yükleme */}
          <div className="space-y-4">
            <Label>Fotoğraflar *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Fotoğrafları seçmek için tıklayın veya sürükleyin
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP (Maksimum 10MB)
                  </p>
                </div>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Projeyi Kaydet"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

