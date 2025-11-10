"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code2, Database, Layers, Terminal } from "lucide-react"

const technologies = [
  { name: "Python", icon: Terminal },
  { name: "C#", icon: Code2 },
  { name: ".NET", icon: Layers },
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Code2 },
  { name: "TypeScript", icon: Code2 },
  { name: "Prisma", icon: Database },
  { name: "SAP ABAP", icon: Terminal },
  { name: "Docker", icon: Layers },
  { name: "Git", icon: Terminal },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="about" ref={ref} className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Hakkımda</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Yazılım geliştirme tutkusuyla dolu, sürekli öğrenmeyi seven bir Full-Stack Developer'ım. Hem backend hem
              frontend teknolojilerinde deneyimliyim ve modern web uygulamaları geliştirmeyi seviyorum.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              .NET, React ve SAP ABAP gibi teknolojilerle çalışarak kurumsal ve bireysel projeler geliştirdim. Her
              projede kod kalitesine, kullanıcı deneyimine ve performansa önem veririm.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Yeni teknolojileri öğrenmeye ve kendimi geliştirmeye her zaman açığım. Ekip çalışmasına yatkın, problem
              çözme odaklı bir yaklaşıma sahibim.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="text-primary text-9xl"
              >
                <Code2 className="h-48 w-48" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold mb-8 text-center text-foreground">Kullandığım Teknolojiler</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {technologies.map((tech, index) => {
              const Icon = tech.icon
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(88, 166, 255, 0.3)" }}
                  className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
