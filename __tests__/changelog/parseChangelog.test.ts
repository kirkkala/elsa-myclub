import fs from "fs"
import path from "path"
import process from "process"

import { describe, expect, it } from "vitest"

import { parseChangelogBlocks } from "../../app/changelog/parseChangelog"
import packageJson from "../../package.json"

describe("parseChangelogBlocks", () => {
  it("parses the version and date from a heading", () => {
    const [block] = parseChangelogBlocks("## 1.2.3 (1.1.2025)\n\n- Uusi juttu 🎉\n")
    expect(block).toMatchObject({ version: "1.2.3", date: "1.1.2025" })
  })

  it("ignores the leading HTML comment / intro before the first heading", () => {
    const markdown = "<!--\nOhje ## 9.9.9 (ei oikea)\n-->\n\n## 1.0.0 (1.1.2025)\n\n- Juttu\n"
    expect(parseChangelogBlocks(markdown).map((b) => b.version)).toEqual(["1.0.0"])
  })

  it("flags a release as a system update when every bullet is a maintenance line", () => {
    const [block] = parseChangelogBlocks(
      "## 1.0.0 (1.1.2025)\n\n- Ylläpito- ja tietoturvapäivityksiä 🛠️🔐\n"
    )
    expect(block.system).toBe(true)
  })

  it("does not flag a feature release as a system update", () => {
    const [block] = parseChangelogBlocks("## 1.0.0 (1.1.2025)\n\n- Uusi ominaisuus 🎉\n")
    expect(block.system).toBe(false)
  })

  it("treats a mixed release (feature + maintenance) as a feature release", () => {
    const markdown = "## 1.0.0 (1.1.2025)\n\n- Uusi ominaisuus 🎉\n- Ylläpitopäivityksiä 🛠️\n"
    expect(parseChangelogBlocks(markdown)[0].system).toBe(false)
  })
})

// Guards that validate the real CHANGELOG.md so it stays renderable and in sync
// with the rest of the app whenever it is edited.
describe("CHANGELOG.md content", () => {
  const changelog = fs.readFileSync(path.join(process.cwd(), "CHANGELOG.md"), "utf8")
  const blocks = parseChangelogBlocks(changelog)

  it("contains at least one release", () => {
    expect(blocks.length).toBeGreaterThan(0)
  })

  it("uses bare, GitHub-tag-friendly version numbers (no 'v' prefix)", () => {
    for (const block of blocks) {
      expect(block.version).toMatch(/^\d+\.\d+\.\d+(-[a-z]+)?$/)
    }
  })

  it("has a date in parentheses for every release", () => {
    for (const block of blocks) {
      expect(block.date.trim(), `missing date for ${block.version}`).not.toBe("")
    }
  })

  it("has at least one bullet for every release", () => {
    for (const block of blocks) {
      expect(block.body, `no bullets for ${block.version}`).toMatch(/^-\s/m)
    }
  })

  it("keeps the newest release in sync with package.json (header version chip)", () => {
    expect(blocks[0]?.version).toBe(packageJson.version)
  })
})
