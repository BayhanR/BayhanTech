"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Globe, CheckCircle } from "lucide-react"
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
  const businesses = [
    {
      name: "Tezerperde.com",
      url: "https://tezerperde.com",
      description: "Modern e-ticaret platformu. Perde, stor ve güneşlik ürünleri için kapsamlı çözümler.",
      icon: "🏠",
      tech: ["Next.js", "React", "TypeScript", ".NET"],
      status: "Aktif",
    },
    {
      name: "Brew Gayrimenkul",
      url: "https://bayhan.tech/brew",
      description: "Gayrimenkul yönetim ve listeleme platformu. Emlak sektörü için modern çözümler.",
      icon: "🏢",
      tech: ["Next.js", "React", "PostgreSQL"],
      status: "Aktif",
    },
    {
      name: "Bayhan Tech",
      url: "https://bayhan.tech",
      description: "Yazılım geliştirme ve danışmanlık hizmetleri. Kurumsal çözümler ve web uygulamaları.",
      icon: "💼",
      tech: [".NET", "React", "Next.js", "SAP ABAP"],
      status: "Aktif",
    },
  ]

  const variant = getVariants(direction)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm"
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

      <div className="flex h-full items-center justify-center p-4 md:p-8 overflow-y-auto pt-20 md:pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-6xl space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
        >
            <h2 className="text-5xl font-bold text-primary">Bayhan Tech</h2>
            <p className="text-xl text-muted-foreground">Geliştirdiğim İşletmeler ve Projeler</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business, index) => (
              <motion.a
                key={business.name}
                href={business.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="block"
              >
                <Card className="h-full border-border bg-card transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-5xl">{business.icon}</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">{business.status}</span>
                      </div>
                    </div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      {business.name}
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                      {business.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {business.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
          <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Hakkında
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Bayhan Tech bünyesinde geliştirilen modern web uygulamaları
                </CardDescription>
            </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  Bayhan Tech olarak, modern web teknolojileri kullanarak çeşitli sektörlerde faaliyet gösteren
                  işletmeler için özel çözümler geliştiriyoruz. E-ticaret platformlarından gayrimenkul yönetim
                  sistemlerine kadar geniş bir yelpazede projeler gerçekleştiriyoruz. Tüm projelerimizde kullanıcı
                  deneyimi, performans ve güvenlik ön planda tutulmaktadır.
                </p>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
