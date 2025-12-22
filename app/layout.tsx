import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { SEO_CONFIG } from "../config"
import { ThemeRegistry } from "../theme"

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.pages.home.title,
    template: `%s | ${SEO_CONFIG.pages.home.title}`,
  },
  description: SEO_CONFIG.pages.home.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SEO_CONFIG.pages.home.openGraph.title,
    title: SEO_CONFIG.pages.home.openGraph.title,
    description: SEO_CONFIG.pages.home.openGraph.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.pages.home.openGraph.title,
    description: SEO_CONFIG.pages.home.openGraph.description,
  },
  keywords: SEO_CONFIG.defaults.additionalMetaTags.find((tag) => tag.name === "keywords")?.content,
  authors: [
    {
      name:
        SEO_CONFIG.defaults.additionalMetaTags.find((tag) => tag.name === "author")?.content || "",
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
