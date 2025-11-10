"use client"

import { motion } from "framer-motion"

export function BayhanTechLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Main outer triangle */}
          <path
            d="M 50 10 L 90 85 L 10 85 Z"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            className="drop-shadow-lg"
          />

          {/* Top half of B */}
          <path d="M 38 35 L 55 35 Q 62 35 62 42 Q 62 47 55 47 L 38 47 Z" fill="#ef4444" className="drop-shadow-md" />

          {/* Bottom half of B */}
          <path d="M 38 47 L 58 47 Q 65 47 65 55 Q 65 62 58 62 L 38 62 Z" fill="#dc2626" className="drop-shadow-md" />

          {/* Vertical bar of B */}
          <rect x="38" y="35" width="6" height="27" fill="#b91c1c" />

          {/* Inner geometric triangles for detail */}
          <path d="M 50 18 L 58 30 L 42 30 Z" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
          <path d="M 30 65 L 38 75 L 22 75 Z" fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.4" />
          <path d="M 70 65 L 78 75 L 62 75 Z" fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.4" />

          {/* Corner accent lines */}
          <line x1="50" y1="10" x2="50" y2="18" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
          <line x1="10" y1="85" x2="18" y2="77" stroke="#dc2626" strokeWidth="2" opacity="0.8" />
          <line x1="90" y1="85" x2="82" y2="77" stroke="#dc2626" strokeWidth="2" opacity="0.8" />
        </svg>
      </div>

      {/* Company Name */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-red-500">Bayhan</span>
        <span className="text-sm font-semibold tracking-wider text-muted-foreground">TECH</span>
      </div>
    </motion.div>
  )
}
