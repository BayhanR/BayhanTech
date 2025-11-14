"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

// Marka bilgileri
const businesses = [
  {
    id: "perdeci",
    name: "Tezerperde.com",
    category: "perdeci",
    logo: "/tezerlogo.png",
  },
  {
    id: "brew",
    name: "Brew Gayrimenkul",
    category: "brew",
    logo: "/logobrew.png",
  },
]

export function PortalHeader() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  
  // Sadece dashboard sayfalarında dark mode toggle göster
  const isDashboardPage = pathname?.startsWith("/portal/dashboard")

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  const loading = status === "loading"
  const user = session?.user
  const userCategory = (user as any)?.profile?.category || null

  if (loading) return null

  // Kullanıcının marka bilgisini bul
  const userBusiness = userCategory
    ? businesses.find((b) => b.category === userCategory)
    : null

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Sol taraf - Bayhan Tech Logosu */}
        <Link href="/portal" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/bayhan-logo.png"
              alt="Bayhan Tech"
              fill
              priority
              sizes="40px"
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-accent hidden sm:inline">bayhan.tech</span>
        </Link>

        {/* Sağ taraf - Marka Logosu ve Butonlar */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle sadece dashboard'da */}
          {isDashboardPage && <DarkModeToggle />}
          {user && (
            <>
              {/* Marka Logosu */}
              {userBusiness ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50">
                  <div className="relative h-8 w-8 shrink-0">
                    <Image
                      src={userBusiness.logo}
                      alt={userBusiness.name}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden md:inline">
                    {userBusiness.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
