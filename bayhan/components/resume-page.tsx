"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { PageType, Direction } from "@/app/page"

interface ResumePageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
}

const getVariants = (dir: Direction) => {
  // Resume sayfası: About'un altında (artık kullanılmıyor ama yine de mantıklı tutuyoruz)
  // Resume'dan Home'a: Resume yukarı çıkar, Home aşağıdan gelir (Home Resume'un altında değil, About'un solunda)
  // Resume sayfası artık About sayfasının içeriğinde, ayrı bir sayfa olarak kullanılmıyor
  // Ama eğer Resume sayfasına erişilirse, Home'a giderken direction="down" kullanıyoruz
  const variants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    down: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    up: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  return variants[dir]
}

export default function ResumePage({ onNavigate, direction }: ResumePageProps) {
  const variant = getVariants(direction)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-background"
    >
      {/* Left button - Ana Sayfa (sağa çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: 0, right: 150 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sağa çekildiğinde (dikey hareket yok)
          if (info.offset.x > 80 && Math.abs(info.offset.y) < 30) {
            onNavigate("home", "left")
          }
        }}
        onClick={() => onNavigate("home", "left")}
        className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Ana Sayfa</span>
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
      </motion.button>

      <div className="h-full overflow-y-auto p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-4xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold text-primary">Özgeçmiş</h1>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              PDF İndir
            </Button>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Kişisel Bilgiler</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-lg text-foreground">
                  <strong>Ad Soyad:</strong> Furkan Bayhan
                </p>
                <p className="text-lg text-foreground">
                  <strong>Pozisyon:</strong> Full-Stack Developer
                </p>
                <p className="text-lg text-foreground">
                  <strong>E-posta:</strong> furkan@bayhan.tech
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">İş Deneyimi</h2>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-bold text-primary">Senior Full-Stack Developer</h3>
                  <p className="text-muted-foreground">Petlas | 2022 - Günümüz</p>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-foreground">
                    <li>Kurumsal web uygulamaları ve dahili sistemler geliştirme</li>
                    <li>SAP ABAP entegrasyonları ve backend çözümleri</li>
                    <li>React ve .NET ile full-stack projeler</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-bold text-primary">Full-Stack Developer</h3>
                  <p className="text-muted-foreground">Agrobest | 2020 - 2022</p>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-foreground">
                    <li>Web uygulamaları ve RESTful API geliştirme</li>
                    <li>Veritabanı tasarımı ve optimizasyonu</li>
                    <li>Modern frontend framework'leri ile kullanıcı arayüzleri</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Eğitim</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-xl font-bold text-primary">Bilgisayar Mühendisliği</h3>
                <p className="text-muted-foreground">Üniversite | 2016 - 2020</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Beceriler</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[".NET Core", "React", "Next.js", "TypeScript", "SAP ABAP", "SQL", "Git", "Docker", "Azure"].map(
                    (skill) => (
                      <div key={skill} className="rounded-lg bg-primary/20 px-4 py-2 text-center text-primary">
                        {skill}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
