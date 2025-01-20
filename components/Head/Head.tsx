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

export default function Head(props: HeadProps): React.ReactElement {
  const { pathname } = useRouter()
  const pageType = (pathname.slice(1) || "home") as PageType
  // Add fallback to home page meta if current page type not found
  const pageMeta = SEO_CONFIG.pages[pageType] || SEO_CONFIG.pages.home

  return (
    <NextSeo
      title={props.title || pageMeta.title}
      description={props.description || pageMeta.description}
      openGraph={{
        title: props.ogTitle || pageMeta.openGraph.title,
        description: props.ogDescription || pageMeta.openGraph.description,
      }}
    />
  )
}
