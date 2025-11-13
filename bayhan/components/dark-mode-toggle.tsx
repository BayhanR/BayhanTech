"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true) // Default karanlık mod

  useEffect(() => {
    // Portal sayfalarında başlangıçta karanlık tema (default)
    const isDark = document.documentElement.classList.contains("dark")
    if (!isDark) {
      document.documentElement.classList.add("dark")
    }
    setIsDark(true)
  }, [])

  const toggleDarkMode = () => {
    const currentIsDark = document.documentElement.classList.contains("dark")
    const newIsDark = !currentIsDark
    
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? "Açık Tema" : "Karanlık Tema"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </motion.button>
  )
}

