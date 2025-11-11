"use client"

import { useState, useCallback } from "react"
import { flushSync } from "react-dom"
import { AnimatePresence } from "framer-motion"
import HomePage from "@/components/home-page"
import AboutPage from "@/components/about-page"
import ProjectsPage from "@/components/projects-page"
import ClientsPage from "@/components/clients-page"
import PortalPage from "@/components/portal-page"

export type PageType = "home" | "about" | "projects" | "clients" | "portal"
export type Direction = "left" | "right" | "down" | "up"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("home")
  const [direction, setDirection] = useState<Direction>("right")
  const [previousPage, setPreviousPage] = useState<PageType | null>(null)

  const handleNavigate = useCallback((page: PageType, dir: Direction) => {
    // Önceki sayfayı kaydet
    setPreviousPage(currentPage)

    // Direction'ı önce flushSync ile güncelle - bu sayede exit animasyonu doğru direction ile çalışır
    flushSync(() => {
    setDirection(dir)
    })
    
    // Sonra sayfayı değiştir
    setCurrentPage(page)
    
    // Ana sayfaya gelince scroll'u sıfırla
    if (page === "home") {
      window.scrollTo(0, 0)
  }
  }, [currentPage])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait" initial={false}>
        {currentPage === "home" && (
          <HomePage key="home" onNavigate={handleNavigate} direction={direction} fromPage={previousPage || undefined} />
        )}
        {currentPage === "about" && (
          <AboutPage key="about" onNavigate={handleNavigate} direction={direction} />
        )}
        {currentPage === "projects" && (
          <ProjectsPage key="projects" onNavigate={handleNavigate} direction={direction} />
        )}
        {currentPage === "clients" && (
          <ClientsPage
            key="clients"
            onNavigate={handleNavigate}
            direction={direction}
            dragOffset={{ x: 0, y: 0 }}
            onDragUpdate={() => {}}
          />
        )}
        {currentPage === "portal" && (
          <PortalPage key="portal" onNavigate={handleNavigate} direction={direction} />
        )}
      </AnimatePresence>
    </main>
  )
}
