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
  return (
    <Layout>
      <Header />
      <BackLink />
      <Info title="Versiohistoria" expandable={false}>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Info>
      <BackLink />
      <Footer />
    </Layout>
  )
}
