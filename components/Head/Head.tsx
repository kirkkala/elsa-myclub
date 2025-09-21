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

export default function Head(props: HeadProps) {
  const { pathname } = useRouter()
  const path = pathname.slice(1) || "home"
  const pageMeta =
    path in SEO_CONFIG.pages ? SEO_CONFIG.pages[path as PageType] : SEO_CONFIG.pages.home

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
