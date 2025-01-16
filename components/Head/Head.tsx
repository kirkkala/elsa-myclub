import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { SEO_CONFIG } from "../../config"

type PageType = keyof typeof SEO_CONFIG.pages

interface HeadProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
}

export default function Head({
  title,
  description,
  ogTitle,
  ogDescription
}: HeadProps): React.ReactElement {
  const { pathname } = useRouter()
  const pageType = pathname.slice(1) || "home"
  const pageMeta = SEO_CONFIG.pages[pageType as PageType] || SEO_CONFIG.pages.home

  return (
    <NextSeo
      title={title || pageMeta.title}
      description={description || pageMeta.description}
      openGraph={{
        title: ogTitle || pageMeta.openGraph.title,
        description: ogDescription || pageMeta.openGraph.description,
      }}
    />
  )
}
