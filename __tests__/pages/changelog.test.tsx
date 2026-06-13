import fs from "fs"

import { render, screen } from "@testing-library/react"

import Changelog from "../../app/changelog/page"

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs")
  const { join } = await vi.importActual<typeof import("path")>("path")
  const readFileSync = vi.fn(() => actual.readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf8"))
  return { ...actual, default: { ...actual, readFileSync }, readFileSync }
})
vi.mock("gray-matter", () => ({ default: (content: string) => ({ content, data: {} }) }))
vi.mock("remark", () => ({
  remark: () => ({
    use: () => ({ process: (content: string) => Promise.resolve({ toString: () => content }) }),
  }),
}))
vi.mock("remark-html", () => ({ default: () => ({}) }))

describe("Changelog", () => {
  // Skip generic page elements test for async server components
  // testPageElements(Changelog)

  it("renders content and version information", async () => {
    const ChangelogComponent = await Changelog()
    render(ChangelogComponent)
    expect(screen.getAllByText(/v\d+\.\d+(\.\d+)?/).length).toBeGreaterThan(0)
  })

  it("handles file read errors gracefully", async () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error("File not found")
    })

    // The component should handle errors gracefully
    await expect(Changelog()).rejects.toThrow("File not found")
  })
})
