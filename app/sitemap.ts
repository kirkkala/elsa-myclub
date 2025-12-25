import type { MetadataRoute } from "next"

import { PAGES, SITE_CONFIG } from "../config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.baseUrl

  return PAGES.map((page) => ({
    url: `${baseUrl}${page.path === "/" ? "" : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.sitemap.changeFrequency,
    priority: page.sitemap.priority,
  }))
}
