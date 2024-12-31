import styles from '../styles/Home.module.scss'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'
import { SITE_CONFIG } from '../config'

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
      <p className={styles.backLink}>
        <Link href="/">← Takaisin</Link>
      </p>
      <div className={styles.header}>
        <h1>{SITE_CONFIG.name}</h1>
      </div>
      <h2>Muutosloki</h2>
      <div
        className={styles.changelogContent}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <p className={styles.backLink}>
        <Link href="/">← Takaisin</Link>
      </p>
    </div>
  )
}
