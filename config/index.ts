import process from "process"

import packageJson from "../package.json"

// Site Configuration
const SITE_CONFIG = {
  name: "eLSA → MyClub Muuntaja",
  version: `v${packageJson.version}`,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://elsa-myclub.hnmky.fi",
  author: {
    name: packageJson.author.name,
    email: packageJson.author.email,
    url: packageJson.author.url,
  },
  links: {
    githubAuthorUrl: packageJson.author.url,
    githubAppRepoUrl: packageJson.repository.url,
    authorHomepageUrl: "https://kirkkala.com",
    elsa: "https://elsa.basket.fi/",
    myclub: "https://hnmky.myclub.fi/",
  },
} as const

// Site-wide notification banner shown on every page. Use this to communicate
// known issues to users, e.g. a bug being fixed or an eLSA Excel format change.
// Set `enabled: false` to hide it.
//   - severity "alert":   red banner for urgent/breaking issues
//   - severity "warning": amber banner for heads-up notices
const NOTIFICATION: {
  enabled: boolean
  severity: "alert" | "warning"
  message: string
} = {
  enabled: false,
  severity: "warning",
  message: "Notifikaatioviesti...",
}

// Search engine optimization (same metadata for all pages)
const SEO_CONFIG = {
  title: `${SITE_CONFIG.name} | HNMKY`,
  description: "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi",
  openGraph: {
    title: SITE_CONFIG.name,
    description: "Muunna eLSA:n excel tiedostot MyClub-yhteensopiviksi parilla klikkauksella",
    url: SITE_CONFIG.baseUrl,
    type: "website",
    siteName: SITE_CONFIG.name,
    image: `${SITE_CONFIG.baseUrl}/images/elsa-myclub-og.png`,
  },
  keywords: "HNMKY, eLSA, MyClub, basketball, koripallo, excel, converter, muunnin",
  author: SITE_CONFIG.author.name,
} as const

// Pages Configuration (single source of truth for navigation and sitemap)
const PAGES = [
  {
    path: "/",
    label: "Etusivu",
    sitemap: { changeFrequency: "monthly" as const, priority: 1 },
  },
  {
    path: "/info",
    label: "Tietoa sovelluksesta",
    sitemap: { changeFrequency: "monthly" as const, priority: 0.8 },
  },
  {
    path: "/docs",
    label: "Käyttöohjeet",
    sitemap: { changeFrequency: "monthly" as const, priority: 0.8 },
  },
]

// Export everything after definitions
export { SITE_CONFIG, SEO_CONFIG, PAGES, NOTIFICATION }
