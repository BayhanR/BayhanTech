import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bayhan.tech"
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${siteUrl}${normalizedBase}/sitemap.xml`],
    host: siteUrl,
  }
}

