import Head from "next/head"
import { useRouter } from "next/router"
import { SEO_CONFIG } from "../../config"

type PageType = keyof typeof SEO_CONFIG.pages

interface HeadProps {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
}

export default function CustomHead(props: HeadProps) {
  const { pathname } = useRouter()
  const path = pathname.slice(1) || "home"
  const pageMeta =
    path in SEO_CONFIG.pages ? SEO_CONFIG.pages[path as PageType] : SEO_CONFIG.pages.home

  const title = props.title || pageMeta.title
  const description = props.description || pageMeta.description
  const ogTitle = props.ogTitle || pageMeta.openGraph.title
  const ogDescription = props.ogDescription || pageMeta.openGraph.description

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
    </Head>
  )
}
