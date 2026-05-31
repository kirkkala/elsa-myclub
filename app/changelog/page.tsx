import fs from "fs"
import path from "path"
import process from "process"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import matter from "gray-matter"
import type { Metadata } from "next"
import { remark } from "remark"
import html from "remark-html"

import Footer from "../../components/Footer/Footer"
import Layout from "../../components/Layout/Layout"

export const metadata: Metadata = {
  title: "Versiohistoria",
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
      <Typography variant="h2" component="h2">
        Versiohistoria
      </Typography>
      <Box dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <Footer />
    </Layout>
  )
}
