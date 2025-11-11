import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bayhan.tech"
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  const joinUrl = (path: string) => {
    const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
    const normalizedPath = path === "/" ? "" : path
    return `${siteUrl}${normalizedBase}${normalizedPath || "/"}`
  }

  // Yalnızca gerçek sayfalar: ana sayfa ve ana bölümler
  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/about", changeFrequency: "weekly", priority: 0.7 },
    { path: "/clients", changeFrequency: "weekly", priority: 0.7 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.7 },
    { path: "/portal", changeFrequency: "weekly", priority: 0.6 },
  ]

  const lastModified = new Date()

  return routes.map((r) => ({
    url: joinUrl(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}

