import fs from "fs"
import type { Metadata } from "next"
import path from "path"
import { remark } from "remark"
import html from "remark-html"

import ChangelogList from "./ChangelogList"
import { type ChangelogEntry, parseChangelogBlocks } from "./parseChangelog"

export const metadata: Metadata = {
  title: "Versiohistoria",
}

async function getChangelogEntries(): Promise<ChangelogEntry[]> {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  const fileContents = fs.readFileSync(changelogPath, "utf8")

  return Promise.all(
    parseChangelogBlocks(fileContents).map(async ({ body, ...entry }) => ({
      ...entry,
      contentHtml: String(await remark().use(html).process(body)),
    }))
  )
}

export default async function Changelog() {
  return <ChangelogList entries={await getChangelogEntries()} />
}
