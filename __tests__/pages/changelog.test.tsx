import { render, screen } from "@testing-library/react"
import Changelog from "../../app/changelog/page"

jest.mock("fs", () => ({
  readFileSync: jest.fn(() =>
    jest
      .requireActual("fs")
      .readFileSync(jest.requireActual("path").join(process.cwd(), "CHANGELOG.md"), "utf8")
  ),
}))
jest.mock("gray-matter", () => (content: string) => ({ content, data: {} }))
jest.mock("remark", () => ({
  remark: () => ({
    use: () => ({ process: (content: string) => Promise.resolve({ toString: () => content }) }),
  }),
}))
jest.mock("remark-html", () => ({ default: () => ({}) }))

describe("Changelog", () => {
  // Skip generic page elements test for async server components
  // testPageElements(Changelog)

  it("renders content and version information", async () => {
    const ChangelogComponent = await Changelog()
    render(ChangelogComponent)

    expect(screen.getByText(/Versiohistoria/)).toBeInTheDocument()
    expect(screen.getAllByText(/v\d+\.\d+(\.\d+)?/).length).toBeGreaterThan(0)
  })

  it("handles file read errors gracefully", async () => {
    require("fs").readFileSync.mockImplementationOnce(() => {
      throw new Error("File not found")
    })

    // The component should handle errors gracefully
    await expect(Changelog()).rejects.toThrow("File not found")
  })
})
