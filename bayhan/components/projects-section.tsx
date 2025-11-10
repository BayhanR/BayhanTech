"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "TextCapture",
    description: "Metin yakalama ve işleme uygulaması. OCR teknolojisi kullanarak görsellerden metin çıkarma.",
    tags: ["Python", "OCR", "AI"],
    github: "#",
    demo: "#",
  },
  {
    title: "En İyi Ürün",
    description: "E-ticaret platformu için ürün karşılaştırma ve öneri sistemi.",
    tags: ["React", "Next.js", "TypeScript"],
    github: "#",
    demo: "#",
  },
  {
    title: "SummarAI",
    description: "Yapay zeka destekli metin özetleme uygulaması. Uzun metinleri anlamlı özetlere dönüştürür.",
    tags: ["Python", "AI", "NLP"],
    github: "#",
    demo: "#",
  },
  {
    title: "Kv Wiki Page",
    description: "Kişisel bilgi yönetim sistemi. Not alma ve bilgi organizasyonu için modern wiki.",
    tags: ["React", "TypeScript", "Prisma"],
    github: "#",
    demo: "#",
  },
  {
    title: "Auth Root",
    description: "Modern authentication sistemi. JWT tabanlı güvenli kullanıcı yönetimi.",
    tags: [".NET", "C#", "JWT"],
    github: "#",
    demo: "#",
  },
]

export default function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="projects" ref={ref} className="min-h-screen py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Projeler</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Geliştirdiğim bazı projeler ve uygulamalar</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
