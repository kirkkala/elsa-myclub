import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"

import { SEO_CONFIG } from "../config"
import { ThemeRegistry } from "../theme"

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.title,
    template: `%s | ${SEO_CONFIG.title}`,
  },
  description: SEO_CONFIG.description,
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
    siteName: SEO_CONFIG.openGraph.title,
    title: SEO_CONFIG.openGraph.title,
    description: SEO_CONFIG.openGraph.description,
    images: [{ url: SEO_CONFIG.openGraph.image }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.openGraph.title,
    description: SEO_CONFIG.openGraph.description,
    images: [SEO_CONFIG.openGraph.image],
  },
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: SEO_CONFIG.author }],
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
