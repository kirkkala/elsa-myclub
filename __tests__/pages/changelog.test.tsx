import { render, screen } from "@testing-library/react"
import Changelog, { getStaticProps } from "../../pages/changelog"
import packageJson from "../../package.json"
import { SITE_CONFIG } from "../../config"

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/changelog",
  }),
}))

// Mock fs module but keep real readFileSync for CHANGELOG.md
jest.mock("fs", () => {
  const actualFs = jest.requireActual("fs")
  return {
    readFileSync: jest.fn((filePath) => {
      if (filePath.includes("CHANGELOG.md")) {
        return actualFs.readFileSync(filePath, "utf8")
      }
      return ""
    }),
  }
})

// Mock gray-matter properly
jest.mock("gray-matter", () => {
  return function matter(fileContent: string) {
    return {
      content: fileContent,
      data: {},
      isEmpty: false,
      excerpt: "",
    }
  }
})

// Enhanced remark mock to handle more markdown elements
jest.mock("remark", () => ({
  remark: () => ({
    use: () => ({
      process: (content: string) =>
        Promise.resolve({
          toString: () => {
            return content
              .replace(/^### (.*$)/gm, "<h3>$1</h3>")
              .replace(/^## (.*$)/gm, "<h3>$1</h3>")
              .replace(/^# (.*$)/gm, "<h2>$1</h2>")
              .replace(/^- (.*$)/gm, "<li>$1</li>")
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
              .replace(/`([^`]+)`/g, "<code>$1</code>")
              .replace(/\n\n/g, "</p><p>")
              .replace(/^(.+)$/gm, "<p>$1</p>")
          },
        }),
    }),
  }),
}))

jest.mock("remark-html", () => ({
  default: () => ({}),
}))

describe("Changelog page", () => {
  it("renders changelog content with proper structure", async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    // Test the main page title from config
    expect(screen.getByText(SITE_CONFIG.name)).toBeInTheDocument()

    // Test that the changelog content is rendered
    expect(screen.getByText(/Versiohistoria/)).toBeInTheDocument()

    // Test that version numbers are displayed
    const versionElements = screen.getAllByText(/v\d+\.\d+\.\d+-beta/)
    expect(versionElements.length).toBeGreaterThan(0)

    // Test the version history text
    expect(screen.getByText("(versiohistoria)")).toBeInTheDocument()
  })

  it("renders version headings and content correctly", async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    // Test that version headings exist
    const versionHeadings = screen.getAllByRole("heading", {
      name: /v\d+\.\d+\.\d+-beta \(\d{4}-\d{2}-\d{2}\)/,
    })
    expect(versionHeadings.length).toBeGreaterThan(0)

    // Test specific known content
    expect(screen.getByText(/Tekninen päivitys/)).toBeInTheDocument()
    expect(screen.getByText(/Pelin lämppä/)).toBeInTheDocument()
  })

  it("ensures package.json version matches latest changelog version", async () => {
    const { props } = await getStaticProps()

    // Extract the latest version from CHANGELOG.md
    const versionMatch = props.contentHtml.match(/<h3>v(\d+\.\d+\.\d+-beta)/)
    expect(versionMatch).toBeTruthy()

    const latestChangelogVersion = versionMatch![1]
    const packageVersion = packageJson.version

    // Compare the versions
    expect(latestChangelogVersion).toBe(packageVersion)
  })

  it("preserves markdown formatting and emojis", async () => {
    const { props } = await getStaticProps()

    // Test that markdown elements are preserved
    expect(props.contentHtml).toContain("<li>")
    expect(props.contentHtml).toContain("<h3>")
    expect(props.contentHtml).toContain("<p>")

    // Test few emojis from CHANGELOG.md that they are rendered
    expect(props.contentHtml).toContain("💅")
    expect(props.contentHtml).toContain("🤖")
  })

  it("renders navigation and footer correctly", async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    // Test back link
    const backLinks = screen.getAllByRole("link", { name: /Takaisin/ })
    expect(backLinks.length).toBeGreaterThan(0)
    const homeLink = backLinks.find((link) => link.getAttribute("href") === "/")
    expect(homeLink).toBeInTheDocument()

    // Test footer content
    expect(screen.getByText(/Made with/)).toBeInTheDocument()
    expect(screen.getByText(/Timo Kirkkala/)).toBeInTheDocument()
    expect(screen.getByText(/Source code published on/)).toBeInTheDocument()
    expect(screen.getByText(/GitHub/)).toBeInTheDocument()
  })

  it("handles edge cases gracefully", async () => {
    // Test file read errors
    const mockFs = require("fs")
    mockFs.readFileSync.mockImplementationOnce(() => {
      throw new Error("File not found")
    })
    await expect(getStaticProps()).rejects.toThrow("File not found")

    // Test empty content
    mockFs.readFileSync.mockImplementationOnce(() => "")
    const { props } = await getStaticProps()
    expect(props.contentHtml).toBe("")
  })

  it("renders with proper page structure", async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    // Test that the page has proper semantic structure
    expect(screen.getByRole("main")).toBeInTheDocument()

    // Test that headings exist
    const headings = screen.getAllByRole("heading")
    expect(headings.length).toBeGreaterThan(0)
  })
})
