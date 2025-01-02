import styles from '../styles/Main.module.scss'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Header from '../components/Header/Header'
import BackLink from '../components/BackLink/BackLink'
import Footer from '../components/Footer/Footer'

export async function getStaticProps() {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
  const fileContents = fs.readFileSync(changelogPath, 'utf8')

  const { content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)

  const contentHtml = processedContent.toString()

  return {
    props: {
      contentHtml
    }
  }
}

interface ChangelogProps {
  contentHtml: string
}

export default function Changelog({ contentHtml }: ChangelogProps) {
  return (
    <div className={styles.container}>
      <Header />
      <BackLink />
      <div className={styles.changelogContent}>
        <h2>Versiohistoria</h2>
        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
      <BackLink />
      <Footer />
    </div>
  )
}
