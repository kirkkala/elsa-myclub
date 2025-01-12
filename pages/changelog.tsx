import BackLink from '../components/BackLink/BackLink'
import Info from '../components/Info/Info'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Layout from '../components/Layout/Layout'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Head from '../components/Head/Head'
import { SEO_CONFIG } from '../config'
import { useRouter } from 'next/router'

type PageType = keyof typeof SEO_CONFIG.pages
interface ChangelogProps {
  contentHtml: string
}

export async function getStaticProps() {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
  const fileContents = fs.readFileSync(changelogPath, 'utf8')
  const { content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    props: { contentHtml }
  }
}

export default function Changelog({ contentHtml }: ChangelogProps) {
  const { pathname } = useRouter()
  const pageType = (pathname === '/' ? 'home' : pathname.slice(1)) as PageType
  const pageMeta = SEO_CONFIG.pages[pageType] || SEO_CONFIG.pages.home
  return (
    <>
      <Head
        title={pageMeta.title}
        description={pageMeta.description}
        ogTitle={pageMeta.openGraph.title}
        ogDescription={pageMeta.openGraph.description}
      />
      <Layout>
        <Header />
        <BackLink />
        <Info title="Versiohistoria" expandable={false}>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </Info>
        <BackLink />
        <Footer />
      </Layout>
    </>
  )
}
