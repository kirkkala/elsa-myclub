export interface ChangelogEntry {
  version: string
  date: string
  system: boolean
  contentHtml: string
}

export interface ChangelogBlock {
  version: string
  date: string
  system: boolean
  body: string
}

// A release counts as a "system update" (hidden behind the toggle) when every
// bullet is a maintenance line. Keep this in sync with the CHANGELOG convention:
// maintenance-only releases use a single "Ylläpito…" line.
export const MAINTENANCE_ITEM = /^-\s*ylläpito/i

// Splits CHANGELOG.md into per-release blocks. The leading HTML comment / intro
// (everything before the first "## " heading) is dropped. Each heading is
// expected to look like "## 2.1.3 (2.8.2026)" — a bare, GitHub-tag-friendly
// version followed by a date in parentheses.
export function parseChangelogBlocks(markdown: string): ChangelogBlock[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [headingLine, ...bodyLines] = block.split("\n")
      const headingMatch = headingLine.match(/^(\S+)\s*\(([^)]*)\)/)
      const version = headingMatch?.[1] ?? headingLine.trim()
      const date = headingMatch?.[2] ?? ""

      const itemLines = bodyLines.map((line) => line.trim()).filter((line) => line.startsWith("-"))
      const system = itemLines.length > 0 && itemLines.every((line) => MAINTENANCE_ITEM.test(line))

      return { version, date, system, body: bodyLines.join("\n").trim() }
    })
}
