import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import process from "process"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { SITE_CONFIG } from "../../config"
import BackLink from "../../components/BackLink/BackLink"
import Info from "../../components/Info/Info"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import Layout from "../../components/Layout/Layout"

export const metadata: Metadata = {
  title: "Versiohistoria",
  description: `${SITE_CONFIG.name} versiohistoria ja viimeisimmät päivitykset`,
  openGraph: {
    title: `${SITE_CONFIG.name} - versiohistoria`,
    description: "Versiohistoria ja viimeisimmät päivitykset",
  },
}

async function getChangelogContent() {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  const fileContents = fs.readFileSync(changelogPath, "utf8")
  const { content } = matter(fileContents)

  // Increase heading level by one to have better semantics on the page
  const shiftedContent = content.replace(/^(#+)/gm, "#$1")

  const processedContent = await remark().use(html).process(shiftedContent)
  return processedContent.toString()
}

export default async function Changelog() {
  const contentHtml = await getChangelogContent()

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
