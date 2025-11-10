"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, FileText, X, Send } from "lucide-react"

export default function Sidebar() {
  const [showContact, setShowContact] = useState(false)
  const [showCV, setShowCV] = useState(false)

  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4"
      >
        <Button
          size="icon"
          onClick={() => setShowContact(!showContact)}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/50"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => setShowCV(!showCV)}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/50"
        >
          <FileText className="h-5 w-5" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 h-screen w-96 bg-card border-r border-border z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">İletişim</h3>
              <Button size="icon" variant="ghost" onClick={() => setShowContact(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">İsim</label>
                <Input placeholder="Adınız Soyadınız" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Mesaj</label>
                <Textarea placeholder="Mesajınızı yazın..." rows={6} />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" />
                Gönder
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCV && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowCV(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-8 bg-card border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-foreground">Özgeçmiş</h3>
                  <Button size="icon" variant="ghost" onClick={() => setShowCV(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-primary">Furkan Bayhan</h4>
                    <p className="text-muted-foreground">Full-Stack Developer</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Eğitim</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Bilgisayar Mühendisliği</p>
                      <p className="text-sm">2018 - 2022</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Deneyim</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-foreground">Full-Stack Developer - Petlas</p>
                        <p className="text-sm text-muted-foreground">2022 - Devam Ediyor</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          React, ASP.NET ve modern web teknolojileri ile kurumsal uygulamalar geliştirme
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">SAP ABAP Developer - Agrobest</p>
                        <p className="text-sm text-muted-foreground">2021 - 2022</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          SAP ABAP ve OData entegrasyonları, backend sistemler
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Yetenekler</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Python",
                        "C#",
                        ".NET",
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Prisma",
                        "SAP ABAP",
                        "Docker",
                        "Git",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <FileText className="h-4 w-4 mr-2" />
                    CV İndir (PDF)
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
