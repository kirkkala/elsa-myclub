import fs from "fs"

import { fireEvent, render, screen } from "@testing-library/react"

import ChangelogList from "../../app/changelog/ChangelogList"
import Changelog from "../../app/changelog/page"
import type { ChangelogEntry } from "../../app/changelog/parseChangelog"
import { SITE_CONFIG } from "../../config"

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs")
  const { join } = await vi.importActual<typeof import("path")>("path")
  const readFileSync = vi.fn(() => actual.readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf8"))
  return { ...actual, default: { ...actual, readFileSync }, readFileSync }
})
vi.mock("remark", () => ({
  remark: () => ({
    use: () => ({ process: (content: string) => Promise.resolve({ toString: () => content }) }),
  }),
}))
vi.mock("remark-html", () => ({ default: () => ({}) }))

const entries: ChangelogEntry[] = [
  {
    version: "2.1.3",
    date: "2.8.2026",
    system: true,
    contentHtml: "<ul><li>Ylläpitopäivityksiä</li></ul>",
  },
  {
    version: "2.1.0",
    date: "31.5.2026",
    system: false,
    contentHtml: "<ul><li>Uusi ominaisuus</li></ul>",
  },
  {
    version: "2.0.6",
    date: "11.4.2026",
    system: true,
    contentHtml: "<ul><li>Tietoturvapäivitys</li></ul>",
  },
]

describe("ChangelogList", () => {
  it("hides technical releases by default but always keeps the newest one", () => {
    render(<ChangelogList entries={entries} />)

    // Newest release is shown even though it is a system update.
    expect(screen.getByRole("heading", { name: "v2.1.3" })).toBeInTheDocument()
    // Feature release is shown.
    expect(screen.getByRole("heading", { name: "v2.1.0" })).toBeInTheDocument()
    // Older system release is hidden.
    expect(screen.queryByRole("heading", { name: "v2.0.6" })).not.toBeInTheDocument()
  })

  it("reveals technical releases when the toggle is switched off", () => {
    render(<ChangelogList entries={entries} />)

    fireEvent.click(screen.getByRole("switch", { name: "Piilota tekniset päivitykset" }))

    expect(screen.getByRole("heading", { name: "v2.0.6" })).toBeInTheDocument()
  })

  it("links each version to its GitHub release tag (no 'v' prefix in the URL)", () => {
    render(<ChangelogList entries={entries} />)

    const link = screen.getByRole("link", { name: "v2.1.0" })
    expect(link).toHaveAttribute("href", `${SITE_CONFIG.links.githubAppRepoUrl}/releases/tag/2.1.0`)
  })

  it("has a single h1 and one h2 per visible release", () => {
    render(<ChangelogList entries={entries} />)

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    // Newest (system) + the one feature release are visible by default.
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2)
  })

  it("does not render the toggle when there are no system releases", () => {
    render(<ChangelogList entries={entries.filter((entry) => !entry.system)} />)

    expect(screen.queryByRole("switch")).not.toBeInTheDocument()
  })
})

describe("Changelog page", () => {
  it("renders the real CHANGELOG.md with version headings and a title", async () => {
    const ChangelogComponent = await Changelog()
    render(ChangelogComponent)

    expect(screen.getByRole("heading", { level: 1, name: "Versiohistoria" })).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0)
  })

  it("propagates file read errors", async () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error("File not found")
    })

    await expect(Changelog()).rejects.toThrow("File not found")
  })
})
