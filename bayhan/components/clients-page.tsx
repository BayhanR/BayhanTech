"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, ChevronUp } from "lucide-react"
import { BayhanTechLogo } from "@/components/logo"
import type { PageType, Direction } from "@/app/page"

interface ClientsPageProps {
  onNavigate: (page: PageType, direction: Direction) => void
  direction: Direction
  dragOffset?: { x: number; y: number }
  onDragUpdate?: (offset: { x: number; y: number }) => void
}

const getVariants = (dir: Direction) => {
  if (dir === "right") {
    return {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    }
  }

  const variants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    down: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    up: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  }
  return variants[dir]
}

const marqueeLogos = [
  {
    name: "Brew Gayrimenkul",
    image: "/brew.png",
    brandLogo: "/logobrew.png",
    description: "Gayrimenkul sektöründe premium konut projeleri için kurumsal web sitesi.",
    url: "https://brew.com.tr", // Örnek URL - gerçek URL'i ekleyebilirsin
  },
  {
    name: "Tezer Perde Tasarım",
    image: "/tezerperde.png",
    brandLogo: "/tezerlogo.png",
    description: "Perde ve dekorasyon markası için e-ticaret ve portföy odaklı çözüm.",
    url: "https://tezerperde.com", // Örnek URL - gerçek URL'i ekleyebilirsin
  },
]

const services = [
    {
    title: "🌐 Web Sitesi Geliştirme",
    description: "Next.js ve modern teknolojilerle hızlı, mobil uyumlu web siteleri.",
  },
  {
    title: "⚙️ Eklenti & Entegrasyon",
    description: "İşletmelere özel fonksiyonlar, eklentiler ve API bağlantıları.",
  },
  {
    title: "🧭 SEO Optimizasyonu",
    description: "Arama motorlarında üst sıralar için teknik ve içerik optimizasyonu.",
  },
  {
    title: "📍 Google İşletme Yönetimi",
    description: "Google Haritalar ve işletme görünürlüğü için kayıt & optimizasyon.",
    },
    {
    title: "💬 Dijital Danışmanlık",
    description: "Marka kimliği, dijital strateji ve dönüşüm danışmanlığı.",
  },
  {
    title: "☁️ Sunucu & Hosting Yönetimi",
    description: "Bayhan.tech altyapısıyla kesintisiz ve güvenli barındırma.",
  },
  {
    title: "🧰 Bakım & Teknik Destek",
    description: "Güvenlik, güncelleme ve performans yönetimi.",
  },
  {
    title: "⚡ Performans & UX Analizi",
    description: "Kullanıcı deneyimi ve hız odaklı iyileştirmeler.",
    },
  ]

export default function ClientsPage({ onNavigate, direction }: ClientsPageProps) {
  const variant = getVariants(direction)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ name: "", email: "", message: "", services: [] as string[] })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const serviceOptions = [
    "Genel Danışmanlık",
    "SEO Hizmeti için Danışmanlık",
    "Web Sitesi Geliştirme",
    "E-ticaret Çözümleri",
    "Dijital Pazarlama",
    "Teknik Destek",
  ]

  const handleServiceChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  // Sonsuz döngü için 4 kopya ekliyoruz (2 set görünür, 2 set animasyon için)
  const duplicatedLogos = useMemo(() => {
    const copies = []
    for (let i = 0; i < 4; i++) {
      copies.push(...marqueeLogos)
    }
    return copies
  }, [])

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 100)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? "Mesaj gönderilirken bir sorun oluştu.")
      }

      setStatus("success")
      setFormData({ name: "", email: "", message: "", services: [] })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Mesaj gönderilemedi, lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed inset-0 bg-background"
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      }}
    >
      {/* Navbar - Şeffaf, en üste */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-30 bg-background/20 backdrop-blur-md border-b border-border/50"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <BayhanTechLogo className="h-10 w-auto" />
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">bayhan.tech</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={() => scrollToSection(servicesRef)}
              variant="ghost"
              className="text-xs sm:text-sm text-foreground hover:text-primary hidden sm:inline-flex"
            >
              Hizmetlerimiz
            </Button>
            <Button
              onClick={() => scrollToSection(portfolioRef)}
              variant="ghost"
              className="text-xs sm:text-sm text-foreground hover:text-primary hidden sm:inline-flex"
            >
              Portfolyo
            </Button>
            <Button
              onClick={() => scrollToSection(brandsRef)}
              variant="ghost"
              className="text-xs sm:text-sm text-foreground hover:text-primary hidden md:inline-flex"
            >
              Markalar
            </Button>
            <Button
              onClick={() => scrollToSection(contactRef)}
              variant="ghost"
              className="text-xs sm:text-sm text-foreground hover:text-primary"
            >
              İletişim
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Right button - Ana Sayfa (sola çek) */}
      <motion.button
        drag="x"
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        dragDirectionLock
        onDragEnd={(_, info) => {
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

      <div ref={scrollContainerRef} className="h-full overflow-y-auto px-4 py-10 sm:px-6 md:px-8 pt-24">
        <div className="mx-auto max-w-5xl w-full space-y-12">
          {/* Hizmet Açıklaması */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
            className="text-center space-y-4"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
              className="text-4xl sm:text-5xl font-bold text-primary"
            >
              Hizmetlerimiz
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 25 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Modern web teknolojileri ve SEO yönetimiyle sitenizin görünürlüğünü artırıyoruz. Arama motorlarında üst
              sıralarda yer almanızı sağlayarak dijital varlığınızı güçlendiriyoruz. Performans odaklı çözümlerle
              kullanıcı deneyimini optimize ediyor ve markanızın online başarısına katkıda bulunuyoruz.
            </motion.p>
          </motion.section>

          {/* Services Grid */}
          <motion.section
            ref={servicesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-semibold text-foreground">Hizmetlerimiz</h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.6 + index * 0.08,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="rounded-xl border border-border bg-card/60 p-6 shadow-sm transition-colors hover:border-primary"
                >
                  <h4 className="text-xl font-semibold text-foreground mb-2">{service.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Portfolio Grid */}
          <motion.section
            ref={portfolioRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 25 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-semibold text-foreground">Portfolyo</h3>
              <p className="text-muted-foreground">
                Aktif olarak yönettiğimiz projeler ve markalar. Detayları görmek için kartlara tıklayın.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {marqueeLogos.map((project, index) => (
                <motion.a
                  key={`portfolio-${project.name}-${index}`}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.8 + index * 0.08,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card/60 text-left shadow-sm transition-colors hover:border-primary"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.brandLogo && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 shadow-md">
                        <img src={project.brandLogo} alt={`${project.name} logo`} className="h-8 w-auto" />
                        <span className="text-sm font-semibold text-foreground">{project.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 px-6 py-5">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Siteyi görüntüle
                      <span aria-hidden>↗</span>
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Çalıştığımız Markalar - Sadece Logolar */}
          <motion.section
            ref={brandsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 25 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-semibold text-foreground">Çalıştığımız Markalar</h3>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/40 px-6 py-8 backdrop-blur">
              <div className="flex w-max items-center gap-12 animate-marquee">
                {duplicatedLogos.map((logo, index) => (
                  <a
                    key={`${logo.name}-${index}`}
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-[200px] items-center justify-center cursor-pointer transition-transform hover:scale-110 flex-shrink-0"
                  >
                    {logo.brandLogo && (
                      <img
                        src={logo.brandLogo}
                        alt={`${logo.name} logo`}
                        className="h-16 w-auto opacity-90 sm:h-20"
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </motion.section>

          {/* İletişim */}
          <motion.section
            ref={contactRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 200, damping: 25 }}
            className="rounded-2xl border border-border bg-card/60 px-6 py-10 shadow-lg backdrop-blur"
          >
            <div className="mx-auto max-w-3xl space-y-6 text-center md:text-left">
              <div className="space-y-3">
                <h3 className="text-3xl font-semibold text-foreground">İletişim</h3>
                <p className="text-muted-foreground">
                  Bilgi almak veya sorularınız için bize ulaşabilirsiniz. Aşağıdaki formu doldurarak bizimle iletişime
                  geçebilirsiniz.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 md:gap-6 text-left">
                <div className="md:col-span-1 space-y-2">
                  <label htmlFor="cta-name" className="text-sm font-medium text-foreground">
                    İsim
                  </label>
                  <Input
                    id="cta-name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-1 space-y-2">
                  <label htmlFor="cta-email" className="text-sm font-medium text-foreground">
                    E-posta
                  </label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    İlgilendiğiniz Hizmetler
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {serviceOptions.map((service) => (
                      <label
                        key={service}
                        className="flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-card/40 p-3 hover:bg-card/60 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-foreground">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="cta-message" className="text-sm font-medium text-foreground">
                    Mesaj
                  </label>
                  <Textarea
                    id="cta-message"
                    placeholder="Mesajınızı yazın..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                  </motion.div>
                </div>
              </form>

            {status === "success" && (
              <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                Teşekkürler! Mesajınız ulaştı, en kısa sürede sizinle iletişime geçeceğim.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin."}
              </p>
            )}
          </div>
        </motion.section>
      </div>
      </div>

      {/* Yukarı Çık Butonu - Sağ Altta Sabit */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}
    </motion.div>
  )
}
