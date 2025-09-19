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

// Test constants and patterns
const VERSION_PATTERNS = {
  flexible: /v\d+\.\d+(\.\d+)?/,
  headingWithDate: /v\d+\.\d+(\.\d+)?(-beta)? \(\d{4}-\d{2}-\d{2}\)/,
  htmlExtraction: /<h3>v(\d+\.\d+(\.\d+)?)/,
} as const

const EXPECTED_CONTENT = {
  pageTitle: SITE_CONFIG.name,
  historyTitle: /Versiohistoria/,
  historySubtitle: "(versiohistoria)",
  knownChangelogContent: [/Tekninen päivitys/, /Pelin lämppä/],
  markdownElements: ["<li>", "<h3>", "<p>"],
  emojis: ["💅", "🤖"],
  footerContent: [/Made with/, /Timo Kirkkala/, /Source code published on/, /GitHub/],
} as const

// Test helper functions
const setupChangelogTest = async () => {
  const { props } = await getStaticProps()
  const renderResult = render(<Changelog {...props} />)
  return { props, renderResult }
}

const getLatestVersionFromChangelog = (contentHtml: string) => {
  const versionMatch = contentHtml.match(VERSION_PATTERNS.htmlExtraction)
  expect(versionMatch).toBeTruthy()
  return versionMatch![1]
}

const expectElementsToBePresent = (patterns: readonly (string | RegExp)[]) => {
  patterns.forEach((pattern) => {
    if (typeof pattern === "string") {
      expect(screen.getByText(pattern)).toBeInTheDocument()
    } else {
      expect(screen.getByText(pattern)).toBeInTheDocument()
    }
  })
}

const expectContentToContain = (content: string, patterns: readonly string[]) => {
  patterns.forEach((pattern) => {
    expect(content).toContain(pattern)
  })
}

describe("Changelog page", () => {
  it("renders changelog content with proper structure", async () => {
    await setupChangelogTest()

    // Test the main page elements
    expectElementsToBePresent([
      EXPECTED_CONTENT.pageTitle,
      EXPECTED_CONTENT.historyTitle,
      EXPECTED_CONTENT.historySubtitle,
    ])

    // Test that version numbers are displayed
    const versionElements = screen.getAllByText(VERSION_PATTERNS.flexible)
    expect(versionElements.length).toBeGreaterThan(0)
  })

  it("renders version headings and content correctly", async () => {
    await setupChangelogTest()

    // Test that version headings exist
    const versionHeadings = screen.getAllByRole("heading", {
      name: VERSION_PATTERNS.headingWithDate,
    })
    expect(versionHeadings.length).toBeGreaterThan(0)

    // Test specific known content
    expectElementsToBePresent(EXPECTED_CONTENT.knownChangelogContent)
  })

  it("ensures package.json version matches latest changelog version", async () => {
    const { props } = await setupChangelogTest()

    const latestChangelogVersion = getLatestVersionFromChangelog(props.contentHtml)
    const packageVersion = packageJson.version

    expect(latestChangelogVersion).toBe(packageVersion)
  })

  it("preserves markdown formatting and emojis", async () => {
    const { props } = await setupChangelogTest()

    // Test that markdown elements are preserved
    expectContentToContain(props.contentHtml, EXPECTED_CONTENT.markdownElements)

    // Test that emojis are rendered
    expectContentToContain(props.contentHtml, EXPECTED_CONTENT.emojis)
  })

  it("renders navigation and footer correctly", async () => {
    await setupChangelogTest()

    // Test back link
    const backLinks = screen.getAllByRole("link", { name: /Takaisin/ })
    expect(backLinks.length).toBeGreaterThan(0)
    const homeLink = backLinks.find((link) => link.getAttribute("href") === "/")
    expect(homeLink).toBeInTheDocument()

    // Test footer content
    expectElementsToBePresent(EXPECTED_CONTENT.footerContent)
  })

  it("handles edge cases gracefully", async () => {
    const mockFs = require("fs")
    
    // Test file read errors
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
    await setupChangelogTest()

    // Test that the page has proper semantic structure
    expect(screen.getByRole("main")).toBeInTheDocument()

    // Test that headings exist
    const headings = screen.getAllByRole("heading")
    expect(headings.length).toBeGreaterThan(0)
  })
})
