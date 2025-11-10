"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const companies = [
  {
    name: "Petlas",
    logo: "/petlas-logo.jpg",
    url: "https://www.petlas.com.tr",
  },
  {
    name: "Agrobest",
    logo: "/agrobest-logo.jpg",
    url: "https://www.agrobest.com",
  },
]

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="experience"
      ref={ref}
      className="min-h-screen py-20 px-4 bg-gradient-to-b from-background to-secondary/50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Çalıştığım Şirketler</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Kurumsal yapılarda profesyonel tecrübeler edindim: React, ASP.NET, SAP ABAP ve OData projelerinde görev
            aldım. Her projede kullanıcı odaklı çözümler geliştirdim.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative overflow-hidden py-12"
        >
          <div className="flex gap-12 animate-marquee">
            {[...companies, ...companies, ...companies].map((company, index) => (
              <motion.a
                key={`${company.name}-${index}`}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <img
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Petlas</h3>
            <p className="text-muted-foreground">
              React ve ASP.NET teknolojileri kullanarak kurumsal web uygulamaları geliştirdim. Modern UI/UX tasarımları
              ile kullanıcı deneyimini iyileştirdim.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Agrobest</h3>
            <p className="text-muted-foreground">
              SAP ABAP ve OData entegrasyonları üzerinde çalıştım. Backend sistemleri geliştirerek veri akışını optimize
              ettim.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
