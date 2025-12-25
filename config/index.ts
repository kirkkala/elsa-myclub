import process from "process"

import packageJson from "../package.json"

// Site Configuration
const SITE_CONFIG = {
  name: "eLSA → MyClub Muuntaja",
  version: `v${packageJson.version}`,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://elsa-myclub.vercel.app",
  author: {
    name: packageJson.author.name,
    email: packageJson.author.email,
    url: packageJson.author.url,
  },
  links: {
    githubAuthorUrl: packageJson.author.url,
    githubAppRepoUrl: packageJson.repository.url,
    elsa: "https://elsa.basket.fi/",
    myclub: "https://hnmky.myclub.fi/",
  },
} as const

// SEO Configuration
const SEO_CONFIG = {
  pages: {
    home: {
      title: SITE_CONFIG.name,
      description: "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi",
      openGraph: {
        title: `${SITE_CONFIG.name} - Helpota jojotöitä`,
        description: "Muunna eLSA:n excel tiedostot MyClub-yhteensopiviksi parilla klikkauksella",
      },
    },
  },
  defaults: {
    openGraph: {
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    additionalMetaTags: [
      {
        name: "keywords",
        content: "HNMKY, eLSA, MyClub, basketball, koripallo, excel, converter, muunnin",
      },
      {
        name: "author",
        content: SITE_CONFIG.author.name,
      },
      {
        name: "version",
        content: SITE_CONFIG.version,
      },
    ],
  },
} as const

// Pages Configuration (single source of truth for navigation and sitemap)
const PAGES = [
  {
    path: "/",
    label: "Etusivu",
    sitemap: { changeFrequency: "monthly" as const, priority: 1 },
  },
  {
    path: "/docs",
    label: "Lisätietoja",
    sitemap: { changeFrequency: "monthly" as const, priority: 0.8 },
  },
  {
    path: "/changelog",
    label: "Versiohistoria",
    sitemap: { changeFrequency: "weekly" as const, priority: 0.5 },
  },
]

// Export everything after definitions
export { SITE_CONFIG, SEO_CONFIG, PAGES }
