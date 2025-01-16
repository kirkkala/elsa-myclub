import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { SEO_CONFIG } from "../../config"

type PageType = keyof typeof SEO_CONFIG.pages

interface MetaProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
}

export default function Head({ title, description, ogTitle, ogDescription }: MetaProps) {
  const { pathname } = useRouter()
  const pageType = (pathname === "/" ? "home" : pathname.slice(1)) as PageType
  const pageMeta = SEO_CONFIG.pages[pageType] || SEO_CONFIG.pages.home

  return (
    <NextSeo
      title={title || pageMeta.title}
      description={description || pageMeta.description}
      openGraph={{
        ...SEO_CONFIG.defaults.openGraph,
        title: ogTitle || pageMeta.openGraph.title,
        description: ogDescription || pageMeta.openGraph.description,
      }}
      additionalMetaTags={SEO_CONFIG.defaults.additionalMetaTags}
    />
  )
}
