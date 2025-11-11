"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PageType, Direction } from "@/app/page"

interface AboutPageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
}

const getVariants = (dir: Direction) => {
  // About sayfası: Home'un sağında
  // About'tan Home'a: About sağa kayar, Home soldan gelir
  if (dir === "left") {
    return {
      initial: { x: "100%" }, // Sağdan gel (Home'dan About'a)
      animate: { x: 0 },
      exit: { x: "100%" }, // Sağa git (About'tan Home'a - About Home'un sağında)
    }
  }
  
  // About'tan Projects'e: About sola kayar, Projects sağdan gelir
  const variants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "-100%" } }, // Projects sağdan gelir, About sola gider
    down: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    up: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  return variants[dir]
}

export default function AboutPage({ onNavigate, direction }: AboutPageProps) {
  const technologies = [
    // Programlama ve Frameworkler
    { name: "Python (otomasyon, web scraping, veri işleme)", icon: "🐍" },
    { name: "C# / .NET & ASP.NET", icon: "🔷" },
    { name: "JavaScript / TypeScript", icon: "📘" },
    { name: "React, Next.js, Vite, Prisma", icon: "⚛️" },
    // ERP / SAP
    { name: "SAP ABAP", icon: "💼" },
    { name: "REST / OData Query Options", icon: "🔗" },
    // Veri & Raporlama
    { name: "Power BI / Power Query (M)", icon: "📊" },
    { name: "SQL (temel sorgulama, filtreleme)", icon: "🗄️" },
    { name: "Excel (otomasyon, entegrasyon)", icon: "📈" },
    // Araçlar
    { name: "Git / GitHub", icon: "🔀" },
    { name: "GitHub Actions (CI/CD)", icon: "⚙️" },
    { name: "Docker & Docker Compose", icon: "🐳" },
  ]

  const variant = getVariants(direction)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 flex min-h-screen bg-background overflow-y-auto"
    >
      {/* Left button - Ana Sayfa (sağa çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: 0, right: 150 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sağa çekildiğinde (dikey hareket yok)
          if ((info.offset.x > 40 && Math.abs(info.offset.y) < 100) || info.velocity.x > 300) {
            onNavigate("home", "left")
          }
        }}
        onClick={() => onNavigate("home", "left")}
        className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Ana Sayfa</span>
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
      </motion.button>

      {/* Right button - Projeler (sola çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sola çekildiğinde (dikey hareket yok)
          if ((info.offset.x < -40 && Math.abs(info.offset.y) < 100) || info.velocity.x < -300) {
            onNavigate("projects", "right")
          }
        }}
        onClick={() => onNavigate("projects", "right")}
        className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Projeler</span>
      </motion.button>

      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl font-bold text-primary mb-2">Furkan Bayhan</h1>
            <p className="text-2xl text-muted-foreground">Full-Stack Developer</p>
          </div>
          <Button asChild className="gap-2 w-full md:w-auto">
            <a href="/Furkan_Bayhan_CV_TR-1.pdf" download>
              <Download className="h-4 w-4" />
              CV İndir (PDF)
            </a>
          </Button>
        </motion.div>

        {/* İletişim Bilgileri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-foreground">bayhan.dev@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <a href="https://bayhan.tech" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                    bayhan.tech
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-foreground">+90 506 140 47 27</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Türkiye</span>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-primary" />
                  <a href="https://linkedin.com/in/bayhan1606/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                    linkedin.com/in/bayhan1606/
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.73.5.98 5.25.98 11.52c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.06-3.05.66-3.7-1.3-3.7-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.9.1-.71.38-1.19.68-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.19 1.12-2.96-.11-.28-.49-1.42.11-2.96 0 0 .93-.3 3.06 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.13-1.43 3.06-1.13 3.06-1.13.6 1.54.22 2.68.11 2.96.69.77 1.12 1.76 1.12 2.96 0 4.21-2.57 5.15-5.02 5.43.39.34.73 1.01.73 2.05 0 1.48-.01 2.67-.01 3.03 0 .29.2.64.76.53 4.34-1.45 7.48-5.56 7.48-10.41C23.02 5.25 18.27.5 12 .5Z"/></svg>
                  <a href="https://github.com/BayhanR" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                    github.com/BayhanR
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Özet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Profesyonel Özet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                Yazılım geliştirme yolculuğumda farklı teknolojilerle çalışma fırsatı buldum ve IT sektörüne olan ilgimi pekiştirdim.
                Web geliştirme (.NET, React, Next.js) ve ERP sistemleri (SAP ABAP, OData) üzerine deneyim kazandım. İş birimlerinin
                ihtiyaçlarına yönelik yazılım projelerinde yer alarak hem teknik hem de kurumsal sistemlere katkı sağladım. Yeni
                teknolojilere açık, öğrenmeyi ve kendimi geliştirmeyi hedefleyen bir yazılım geliştiricisiyim.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* İş Deneyimi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">İş Deneyimi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">Stajyer - Abdülkadir Özcan A.Ş (Petlas)</h3>
                <p className="text-muted-foreground mb-2">2024</p>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>SAP ABAP: OData Service Development, RFC Function Modules</li>
                  <li>Dinamik sorgular ve performans optimizasyonları</li>
                  <li>REST / OData query options ile entegrasyonlar</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">Stajyer - Agrobest Grup</h3>
                <p className="text-muted-foreground mb-2">2025</p>
                <ul className="list-disc list-inside space-y-1 text-foreground">
                  <li>ERP süreçleri ve kurumsal uygulamalara katkı</li>
                  <li>Dokümantasyon, raporlama ve veri odaklı geliştirmeler</li>
                  <li>Takım çalışması ve süreç iyileştirme faaliyetleri</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Eğitim */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Eğitim</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">Balıkesir Üniversitesi - Bilgisayar Mühendisliği</h3>
                <p className="text-muted-foreground">2021 - 2025</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Yetenekler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Yetenekler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-shadow hover:shadow-lg hover:shadow-primary/20"
              >
                    <span className="text-2xl">{tech.icon}</span>
                <span className="text-lg font-semibold text-foreground">{tech.name}</span>
              </motion.div>
            ))}
          </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
