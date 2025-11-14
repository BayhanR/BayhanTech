"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"
import type { PageType, Direction } from "@/app/page"

interface PortalPageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
}

const getVariants = (dir: Direction) => {
  // Portal sayfası: Home'un altında
  // Portal'dan Home'a: Portal aşağı kayar, Home yukarıdan gelir
  if (dir === "down") {
    return {
      initial: { y: "100%" }, // Aşağıdan gel (Home'dan Portal'a)
      animate: { y: 0 },
      exit: { y: "100%" }, // Aşağı git (Portal'dan Home'a - Portal Home'un altında)
    }
  }
  
  const variants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    up: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  return variants[dir]
}

export default function PortalPage({ onNavigate, direction }: PortalPageProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Ana sayfadaki portal-page için dark class'ı kaldırma
  // Sadece ayrı route'larda (/portal) açık tema olacak

  const businesses = [
    {
      id: "perdeci",
      name: "Tezerperde.com",
      category: "perdeci",
      description: "Perde, stor ve güneşlik ürünleri için e-ticaret platformu",
      logo: "/tezerlogo.png",
    },
    {
      id: "brew",
      name: "Brew Gayrimenkul",
      category: "brew",
      description: "Gayrimenkul yönetim ve listeleme platformu",
      logo: "/logobrew.png",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBusiness) {
      setError("Lütfen bir işletme seçin")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Kullanıcı bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.")
        return
      }

      if (result?.ok) {
        // Kullanıcı bilgilerini al
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        // Kullanıcının şirket category'sini kontrol et
        if (data.user?.profile?.category) {
          const userCategory = data.user.profile.category
          if (userCategory !== selectedBusiness) {
            const allowedBusiness = businesses.find((b) => b.category === userCategory)
            await signOut({ redirect: false }) // Sign out
            setError(
              allowedBusiness
                ? `Bu hesap sadece ${allowedBusiness.name} için yetkilidir. Lütfen doğru işletmeyi seçin.`
                : "Bu hesap belirli bir işletmeye atanmış. Lütfen sistem yöneticisi ile iletişime geçin."
            )
            return
          }
        }

        // Login başarılı, portal dashboard'a yönlendir
        router.push("/portal/dashboard")
        router.refresh()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const variant = getVariants(direction)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-background backdrop-blur-sm"
    >
      {/* Top button - Ana Sayfa (aşağı çek) */}
      <motion.button
        drag="y"
        dragConstraints={{ top: 0, bottom: 150 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece aşağı çekildiğinde (yatay hareket yok)
          if ((info.offset.y > 40 && Math.abs(info.offset.x) < 100) || info.velocity.y > 300) {
            onNavigate("home", "down")
          }
        }}
        onClick={() => onNavigate("home", "down")}
        className="group absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-20 flex cursor-grab flex-col items-center gap-2 bg-transparent px-4 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Ana Sayfa</span>
        <div className="h-1 w-8 md:w-12 rounded-full bg-primary" />
      </motion.button>

      <div className="flex flex-col h-full">
        {/* Üstte Şirket Logoları */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 md:gap-12 pt-20 md:pt-24 pb-8 px-4"
        >
          {businesses.map((business) => (
            <motion.button
              key={business.id}
              onClick={() => setSelectedBusiness(business.category)}
              className={`relative group flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedBusiness === business.category
                  ? "bg-green-500/20 border-2 border-green-500 scale-105"
                  : "bg-card/50 border-2 border-border/50 hover:border-primary/50 hover:bg-card/80"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <img
                  src={business.logo}
                  alt={business.name}
                  className={`w-24 h-24 md:w-32 md:h-32 object-contain transition-all duration-300 ${
                    selectedBusiness === business.category ? "brightness-110" : "opacity-70"
                  }`}
                />
                {selectedBusiness === business.category && (
          <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
          </motion.div>
                )}
              </div>
              <span
                className={`text-sm md:text-base font-medium transition-colors ${
                  selectedBusiness === business.category
                    ? "text-green-500"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                      {business.name}
                        </span>
            </motion.button>
            ))}
        </motion.div>

        {/* Login Formu - Tüm Ekran */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
                <Building2 className="w-8 h-8 md:w-10 md:h-10" />
                Portal Girişi
              </h2>
              <p className="text-lg text-muted-foreground">
                {selectedBusiness
                  ? `${businesses.find((b) => b.category === selectedBusiness)?.name} için giriş yapın`
                  : "İşletmenizi seçin ve giriş yapın"}
              </p>
            </motion.div>

            <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle>Giriş Yap</CardTitle>
                <CardDescription>
                  Portal'a erişmek için email ve şifrenizi girin
                </CardDescription>
            </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 h-12"
                    />
                  </div>

                  {/* Şifre */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 h-12"
                    />
                  </div>

                  {/* Hata Mesajı */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-destructive/10 border border-destructive/20"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {/* Giriş Butonu */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    size="lg"
                    disabled={isLoading || !selectedBusiness}
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Hesabınız yok mu? Lütfen sistem yöneticisi ile iletişime geçin.
                </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
