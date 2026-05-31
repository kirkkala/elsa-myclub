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

  const processedContent = await remark().use(html).process(content)
  return processedContent.toString()
}

export default async function Changelog() {
  const contentHtml = await getChangelogContent()

  return (
    <Layout>
      <Typography variant="h1" component="h1">
        Versiohistoria
      </Typography>
      <Box dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <Footer />
    </Layout>
  )
}
