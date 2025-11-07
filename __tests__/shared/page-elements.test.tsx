import { render, screen } from "@testing-library/react"
import { SITE_CONFIG } from "../../config"

export const testPageElements = (
  PageComponent: React.ComponentType<Record<string, unknown>>,
  props: Record<string, unknown> = {}
) => {
  describe("Generic Page Elements", () => {
    it("renders header, footer, and semantic structure", () => {
      render(<PageComponent {...props} />)

      // Header with logos and version
      expect(screen.getByRole("banner")).toBeInTheDocument()
      expect(screen.getByAltText("eLSA")).toBeInTheDocument()
      expect(screen.getByAltText("MyClub")).toBeInTheDocument()
      expect(screen.queryAllByText(SITE_CONFIG.version).length).toBeGreaterThanOrEqual(1)

      // Footer with author and links
      const footer = screen.getByRole("contentinfo")
      expect(footer).toHaveTextContent("Made with")
      expect(footer).toHaveTextContent(SITE_CONFIG.author.name)
      expect(footer).toHaveTextContent("GitHub")

      // Semantic structure
      expect(screen.getByRole("main")).toBeInTheDocument()
      expect(screen.getAllByRole("heading").length).toBeGreaterThan(0)
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)

      // Back navigation
      const backLinks = screen.getAllByRole("link", { name: /Etusivulle/ })
      expect(backLinks.length).toBeGreaterThan(0)
      expect(backLinks.find((link) => link.getAttribute("href") === "/")).toBeInTheDocument()
    })
  })
}

describe("Site Configuration", () => {
  it("has valid config", () => {
    expect(SITE_CONFIG.name).toBeDefined()
    expect(SITE_CONFIG.version).toMatch(/^v\d+\.\d+(\.\d+)?/)
    expect(SITE_CONFIG.author.name).toBeDefined()
    expect(SITE_CONFIG.links.githubAppRepoUrl).toContain("github")
    expect(SITE_CONFIG.links.elsa).toContain("elsa")
    expect(SITE_CONFIG.links.myclub).toContain("myclub")
  })
})
