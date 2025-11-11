import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
const siteTitle = "Furkan Bayhan | Web Sitesi Geliştirme & SEO Danışmanlığı"
const siteDescription =
  "Furkan Bayhan; Next.js, .NET ve SAP ABAP altyapısıyla KOBİ’lere özel web sitesi kurulum, SEO optimizasyonu, dijital danışmanlık ve sürdürülebilir bakım hizmetleri sunar."
const logoPath = "/Adsız_tasarım-removebg-preview.png"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "bayhan.tech",
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
    "SEO desteği",
    "Dijital danışmanlık",
    "Next.js geliştirme",
    ".NET entegrasyonları",
    "SAP ABAP çözümleri",
    "Bakım ve teknik destek",
    "Performans optimizasyonu",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "bayhan.tech Hizmet Kataloğu",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Sitesi Geliştirme",
          description: "Next.js, React ve .NET ile hızlı, responsive ve SEO uyumlu web çözümleri.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO Optimizasyonu",
          description: "Teknik SEO, içerik stratejisi ve Google görünürlüğü için optimizasyon paketleri.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Dijital Danışmanlık",
          description: "KOBİ’ler için dijital strateji, marka kimliği ve dönüşüm odaklı danışmanlık.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sunucu ve Hosting Yönetimi",
          description: "VDS üzerinde güvenli barındırma, bakım ve sürekli performans takibi.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bakım & Teknik Destek",
          description: "Güncelleme, güvenlik, bug fix ve sürdürülebilir bakım hizmetleri.",
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
    template: "%s | Furkan Bayhan",
  },
  description: siteDescription,
  keywords: [
    "web sitesi kurma",
    "Next.js geliştirici",
    "SEO desteği",
    "kurumsal web tasarım",
    "dijital danışmanlık",
    "KOBİ web çözümleri",
    "Furkan Bayhan",
    "bayhan.tech",
  ],
  applicationName: "bayhan.tech",
  authors: [{ name: "Furkan Bayhan", url: siteUrl }],
  creator: "Furkan Bayhan",
  publisher: "bayhan.tech",
  category: "technology",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "bayhan.tech",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}${logoPath}`,
        width: 500,
        height: 500,
        alt: "Furkan Bayhan - Web Sitesi ve SEO Danışmanlığı",
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
        {children}
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
