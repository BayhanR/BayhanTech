"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function BayhanTechLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="relative h-14 w-14 shrink-0 rounded-xl bg-background/80 p-1.5 shadow-lg shadow-primary/20 backdrop-blur">
        <Image
          src="/Adsız_tasarım-removebg-preview.png"
          alt="Bayhan Tech logosu"
          fill
          priority
          sizes="56px"
          className="object-contain"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-bold text-red-500 tracking-tight">Bayhan</span>
        <span className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">Tech</span>
      </div>
    </motion.div>
  )
}
