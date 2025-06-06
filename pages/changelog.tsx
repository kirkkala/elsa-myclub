import React from "react"
import BackLink from "../components/BackLink/BackLink"
import Info from "../components/Info/Info"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import Layout from "../components/Layout/Layout"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import Head from "../components/Head/Head"

interface ChangelogProps {
  contentHtml: string
}

export async function getStaticProps(): Promise<{ props: ChangelogProps }> {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  const fileContents = fs.readFileSync(changelogPath, "utf8")
  const { content } = matter(fileContents)

  // Increase heading level by one to have better semantics on the page
  const shiftedContent = content.replace(/^(#+)/gm, "#$1")

  const processedContent = await remark().use(html).process(shiftedContent)
  const contentHtml = processedContent.toString()

  return {
    props: { contentHtml },
  }
}

export default function Changelog({ contentHtml }: ChangelogProps): React.ReactElement {
  return (
    <>
      <Head />
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
