import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const siteUrl = "https://bayhan.tech"
const siteTitle = "Bayhan Tech | Web Sitesi Geliştirme, SEO Hizmeti & Next.js Geliştirme"
const siteDescription =
  "Bayhan Tech; Next.js web geliştirme, SEO hizmeti, web sitesi kurma, e-ticaret çözümleri, dijital danışmanlık ve teknik destek hizmetleri sunar. Next.js ile modern web siteleri geliştiriyoruz."
const logoPath = "/bayhan-logo.png"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Bayhan Tech",
  alternateName: "bayhan.tech",
  description: siteDescription,
  url: siteUrl,
  image: `${siteUrl}${logoPath}`,
  telephone: "+90 506 140 47 27",
  email: "mailto:bayhan.dev@gmail.com",
  areaServed: ["Türkiye", "Avrupa"],
  availableLanguage: ["Turkish", "English"],
  sameAs: [
    "https://linkedin.com/in/bayhan1606/",
    "https://github.com/BayhanR",
  ],
  provider: {
    "@type": "Person",
    name: "Furkan Bayhan",
    jobTitle: "Full-Stack Developer",
    url: siteUrl,
  },
  serviceType: [
    "Web sitesi kurma",
    "Web sitesi geliştirme",
    "Next.js web geliştirme",
    "Next.js geliştirme",
    "Next.js ile web sitesi",
    "SEO hizmeti",
    "SEO desteği",
    "SEO optimizasyonu",
    "Web geliştirme",
    "Web tasarım",
    "E-ticaret sitesi",
    "E-ticaret çözümleri",
    "Dijital danışmanlık",
    "Google İşletme Yönetimi",
    "Sunucu ve hosting yönetimi",
    "Bakım ve teknik destek",
    "Performans optimizasyonu",
    ".NET entegrasyonları",
    "SAP ABAP çözümleri",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Bayhan Tech Hizmet Kataloğu",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Sitesi Geliştirme",
          description: "Bayhan Tech olarak Next.js web geliştirme, Next.js ile web sitesi kurma ve modern web geliştirme hizmetleri sunuyoruz. Next.js, React ve .NET ile hızlı, responsive ve SEO uyumlu web çözümleri.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO Hizmeti ve Optimizasyonu",
          description: "Bayhan Tech SEO hizmeti ile arama motorlarında üst sıralarda yer alın. Teknik SEO, içerik stratejisi, SEO danışmanlığı ve Google görünürlüğü için optimizasyon paketleri.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Dijital Danışmanlık",
          description: "Bayhan Tech dijital danışmanlık hizmeti ile KOBİ'ler için dijital strateji, marka kimliği ve dönüşüm odaklı danışmanlık sunuyoruz.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sunucu ve Hosting Yönetimi",
          description: "Bayhan Tech sunucu yönetimi ve hosting yönetimi hizmeti. VDS üzerinde güvenli barındırma, bakım ve sürekli performans takibi.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bakım & Teknik Destek",
          description: "Bayhan Tech web bakım ve teknik destek hizmeti. Güncelleme, güvenlik, bug fix ve sürdürülebilir bakım hizmetleri.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Performans & UX Analizi",
          description: "Kullanıcı deneyimi analizi, Core Web Vitals iyileştirme ve hız optimizasyonu.",
        },
      },
    ],
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Bayhan Tech",
  },
  description: siteDescription,
  keywords: [
    "Bayhan Tech",
    "bayhan tech",
    "web sitesi kurma",
    "web sitesi geliştirme",
    "web geliştirme",
    "Next.js web geliştirme",
    "Next.js geliştirme",
    "Next.js ile web sitesi",
    "Next.js geliştirici",
    "Next.js developer",
    "SEO hizmeti",
    "SEO desteği",
    "SEO optimizasyonu",
    "SEO danışmanlığı",
    "web tasarım",
    "kurumsal web tasarım",
    "e-ticaret sitesi",
    "e-ticaret çözümleri",
    "dijital danışmanlık",
    "Google İşletme Yönetimi",
    "hosting yönetimi",
    "sunucu yönetimi",
    "teknik destek",
    "web bakım",
    "KOBİ web çözümleri",
    "Furkan Bayhan",
    "bayhan.tech",
  ],
  applicationName: "Bayhan Tech",
  authors: [{ name: "Furkan Bayhan", url: siteUrl }],
  creator: "Furkan Bayhan",
  publisher: "Bayhan Tech",
  category: "technology",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Bayhan Tech",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}${logoPath}`,
        width: 500,
        height: 500,
        alt: "Bayhan Tech - Web Sitesi Geliştirme ve SEO Hizmeti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@bayhan1606",
    images: [`${siteUrl}${logoPath}`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: logoPath, type: "image/png" }],
    shortcut: [{ url: logoPath, type: "image/png" }],
    apple: [{ url: logoPath, type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
