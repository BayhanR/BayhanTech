"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import type { PageType, Direction } from "@/app/page"
import { BayhanTechLogo } from "@/components/logo"

interface HomePageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
  fromPage?: PageType
}

const getVariants = (dir: Direction, fromPage?: PageType) => {
  // Home sayfası animasyon mantığı: Ana sayfa etrafında dönüş
  // Home merkezde duruyor, diğer sayfalar etrafında dönüyor
  
  // Portal'dan geliyorsa (Portal Home'un altında): Home yukarıdan gelmeli
  if (fromPage === "portal" && dir === "down") {
    return {
      initial: { y: "-100%" }, // Yukarıdan gel (Portal Home'un altında)
      animate: { y: 0 },
      exit: { y: "-100%" }, // Yukarı git (Portal'a giderken) - DOĞRU
    }
  }
  
  // About'tan geliyorsa (About Home'un sağında): Home soldan gelmeli
  if (fromPage === "about" && dir === "left") {
    return {
      initial: { x: "-100%" }, // Soldan gel (About Home'un sağında)
      animate: { x: 0 },
      exit: { x: "-100%" }, // Sola git (Clients'e giderken) - DOĞRU
    }
  }
  
  // Clients'ten geliyorsa (Clients Home'un solunda): Home sağdan gelmeli
  if (fromPage === "clients" && dir === "right") {
    return {
      initial: { x: "100%" }, // Sağdan gel (Clients Home'un solunda)
      animate: { x: 0 },
      exit: { x: "100%" }, // Sağa git (About'a giderken) - DOĞRU
    }
  }
  
  // Projects'ten geliyorsa (Projects Home'un sağında, About'un sağında): Home soldan gelmeli
  if (fromPage === "projects" && dir === "right") {
    return {
      initial: { x: "-100%" }, // Soldan gel (Projects Home'un sağında)
      animate: { x: 0 },
      exit: { x: "-100%" }, // Sola git (Clients'e giderken) - DOĞRU
    }
  }
  
  // Resume'den geliyorsa (Resume About'un altında, Home'un sağında): Home soldan gelmeli
  if (fromPage === "resume" && dir === "left") {
    return {
      initial: { x: "-100%" }, // Soldan gel (Resume Home'un sağında, About'un altında)
      animate: { x: 0 },
      exit: { x: "-100%" }, // Sola git (Clients'e giderken) - DOĞRU
    }
  }
  
  // Home'dan çıkış animasyonları (fromPage yoksa - ilk kez Home'dan çıkıyoruz)
  // Home → Clients: direction="left" → Home sağa gitmeli (Clients Home'un solunda)
  if (!fromPage && dir === "left") {
    return {
      initial: { x: "-100%" }, // Soldan gel (Clients'ten Home'a dönüşte)
      animate: { x: 0 },
      exit: { x: "100%" }, // Sağa git (Home'dan Clients'e) - DÜZELTME
    }
  }
  
  // Home → About: direction="right" → Home sola gitmeli (About Home'un sağında)
  if (!fromPage && dir === "right") {
    return {
      initial: { x: "100%" }, // Sağdan gel (About'tan Home'a dönüşte)
      animate: { x: 0 },
      exit: { x: "-100%" }, // Sola git (Home'dan About'a) - DÜZELTME
    }
  }
  
  // Home → Portal: direction="down" → Home yukarı gitmeli (Portal Home'un altında)
  if (!fromPage && dir === "down") {
    return {
      initial: { y: "100%" }, // Aşağıdan gel (Portal'dan Home'a dönüşte)
      animate: { y: 0 },
      exit: { y: "-100%" }, // Yukarı git (Home'dan Portal'a) - DOĞRU
    }
  }
  
  // Varsayılan durumlar (fallback - kullanılmamalı)
  const variants = {
    left: { 
      initial: { x: "-100%" }, // Soldan gel
      animate: { x: 0 }, 
      exit: { x: "100%" } // Sağa git (Home'dan Clients'e)
    },
    right: { 
      initial: { x: "100%" }, // Sağdan gel
      animate: { x: 0 }, 
      exit: { x: "-100%" } // Sola git (Home'dan About'a)
    },
    down: { 
      initial: { y: "100%" }, // Aşağıdan gel
      animate: { y: 0 }, 
      exit: { y: "-100%" } // Yukarı git (Home'dan Portal'a)
    },
    up: { 
      initial: { y: "-100%" }, // Yukarıdan gel
      animate: { y: 0 }, 
      exit: { y: "100%" } // Aşağı git
    },
  }
  return variants[dir]
}

export default function HomePage({ onNavigate, direction, fromPage }: HomePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Ana sayfaya gelince scroll'u sıfırla
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }

    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(220, 38, 38, 0.5)"
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const variant = getVariants(direction, fromPage)

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute left-8 top-8 z-10">
        <BayhanTechLogo />
      </div>

      {/* Right button - Hakkımda (sola çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sola çekildiğinde (dikey hareket yok)
          if ((info.offset.x < -40 && Math.abs(info.offset.y) < 100) || info.velocity.x < -300) {
            onNavigate("about", "right")
          }
        }}
        onClick={() => onNavigate("about", "right")}
        className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Hakkımda</span>
      </motion.button>

      {/* Left button - Müşteriler (sağa çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: 0, right: 150 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece sağa çekildiğinde (dikey hareket yok)
          if ((info.offset.x > 40 && Math.abs(info.offset.y) < 100) || info.velocity.x > 300) {
            onNavigate("clients", "left")
          }
        }}
        onClick={() => onNavigate("clients", "left")}
        className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex cursor-grab items-center gap-1 md:gap-2 bg-transparent px-3 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <span className="text-sm md:text-lg font-semibold hidden sm:inline">Müşteriler</span>
        <div className="h-8 md:h-12 w-1 rounded-full bg-primary" />
      </motion.button>

      {/* Bottom button - Portal (yukarı çek) */}
      <motion.button
        drag="y"
        dragConstraints={{ top: -150, bottom: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
          // Sadece yukarı çekildiğinde (yatay hareket yok)
          if ((info.offset.y < -40 && Math.abs(info.offset.x) < 100) || info.velocity.y < -300) {
            onNavigate("portal", "down")
          }
        }}
        onClick={() => onNavigate("portal", "down")}
        className="group absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex cursor-grab flex-col items-center gap-2 bg-transparent px-4 md:px-6 py-3 md:py-4 text-foreground opacity-30 transition-opacity duration-300 hover:opacity-100 active:cursor-grabbing touch-none"
      >
        <div className="h-1 w-8 md:w-12 rounded-full bg-primary" />
        <span className="text-sm md:text-lg font-semibold">Portal</span>
      </motion.button>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl font-bold text-foreground md:text-8xl"
          style={{
            textShadow: "0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)",
          }}
        >
          Furkan Bayhan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-muted-foreground md:text-2xl"
        >
          Full-Stack Developer | .NET, React, SAP ABAP
        </motion.p>
      </div>
    </motion.div>
  )
}
