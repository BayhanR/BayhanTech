"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import type { PageType, Direction } from "@/app/page"

interface ProjectsPageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
}

const getVariants = (dir: Direction) => {
  // Projects sayfası: About'un sağında
  // Projects'ten About'a: Projects sağa kayar, About soldan gelir
  // Projects'ten Home'a: Projects sola kayar (Home About'un solunda, Projects About'un sağında)
  // Ama Projects'ten Home'a direkt gidemeyiz, Home About'un solunda
  // Bu yüzden Projects'ten Home'a giderken Projects sola kaymalı (Home'a yaklaşmak için)
  
  // Projects'ten About'a: Projects sağa kayar, About soldan gelir
  if (dir === "left") {
    return {
      initial: { x: "100%" }, // Sağdan gel (About'tan Projects'e)
      animate: { x: 0 },
      exit: { x: "100%" }, // Sağa git (Projects'ten About'a)
    }
  }
  
  // Projects'ten Home'a: Projects sola kayar (Home About'un solunda)
  if (dir === "right") {
    return {
      initial: { x: "100%" }, // Sağdan gel (About'tan Projects'e)
      animate: { x: 0 },
      exit: { x: "-100%" }, // Sola git (Projects'ten Home'a - Home About'un solunda)
    }
  }
  
  const variants = {
    down: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    up: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  return variants[dir]
}

export default function ProjectsPage({ onNavigate, direction }: ProjectsPageProps) {
  const projects = [
    {
      title: "TextCapture",
      description: "OCR ve metin tanıma teknolojisi kullanarak görsellerden metin çıkarma uygulaması",
      tech: ["React", "OCR", "TypeScript"],
    },
    {
      title: "SummarAI",
      description: "Yapay zeka destekli metin özetleme ve analiz platformu",
      tech: ["Next.js", "AI", "OpenAI"],
    },
    {
      title: "Kv Wiki Page",
      description: "Bilgi paylaşım ve dokümantasyon yönetim sistemi",
      tech: [".NET", "React", "SQL"],
    },
    {
      title: "En İyi Ürün",
      description: "E-ticaret karşılaştırma ve ürün değerlendirme platformu",
      tech: ["Next.js", "PostgreSQL", "Stripe"],
    },
    {
      title: "Auth Root",
      description: "Modern kimlik doğrulama ve yetkilendirme sistemi",
      tech: [".NET", "JWT", "OAuth"],
    },
  ]

  const variant = getVariants(direction)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 flex min-h-screen items-center justify-center bg-background p-8"
    >
      {/* Left button - Hakkımda (sağa çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: 0, right: 150 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sağa çekildiğinde (dikey hareket yok)
          if ((info.offset.x > 40 && Math.abs(info.offset.y) < 100) || info.velocity.x > 300) {
            onNavigate("about", "left")
          }
        }}
        onClick={() => onNavigate("about", "left")}
        className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Hakkımda</span>
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
      </motion.button>
      
      {/* Right button - Ana Sayfa (sola çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sola çekildiğinde (dikey hareket yok)
          if ((info.offset.x < -40 && Math.abs(info.offset.y) < 100) || info.velocity.x < -300) {
            onNavigate("home", "right")
          }
        }}
        onClick={() => onNavigate("home", "right")}
        className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Ana Sayfa</span>
      </motion.button>
      

      <div className="max-w-7xl space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold text-primary"
        >
          Projeler
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="h-full border-border bg-card transition-shadow hover:shadow-xl hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-foreground">
                    {project.title}
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
