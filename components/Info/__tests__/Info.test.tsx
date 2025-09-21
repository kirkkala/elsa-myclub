import { render, screen, fireEvent } from "@testing-library/react"
import Info from "../Info"

describe("Info component", () => {
  describe("Non-expandable info", () => {
    it("renders title and content", () => {
      render(
        <Info title="Test Title" expandable={false}>
          <div>Test Content</div>
        </Info>
      )

      expect(screen.getByRole("heading", { name: "Test Title" })).toBeInTheDocument()
      expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    it("does not show expand controls when not expandable", () => {
      render(
        <Info title="Test Title" expandable={false}>
          <div>Test Content</div>
        </Info>
      )

      expect(screen.queryByRole("button")).not.toBeInTheDocument()
      expect(screen.queryByRole("summary")).not.toBeInTheDocument()
    })
  })

  describe("Expandable info", () => {
    it("renders collapsed by default", () => {
      render(
        <Info title="Expandable Info">
          <div>Hidden Content</div>
        </Info>
      )

      expect(screen.queryByText("Hidden Content")).not.toBeVisible()
    })

    it("expands and collapses on click", () => {
      render(
        <Info title="Expandable Info">
          <div>Toggle Content</div>
        </Info>
      )

      const button = screen.getByRole("button")

      // Initially collapsed
      expect(screen.queryByText("Toggle Content")).not.toBeVisible()

      // Click to expand
      fireEvent.click(button)
      expect(screen.getByText("Toggle Content")).toBeVisible()

      // Click to collapse
      fireEvent.click(button)
      expect(screen.queryByText("Toggle Content")).not.toBeVisible()
    })

    it("generates correct ID from title", () => {
      render(
        <Info title="Käyttöohjeet ja tietoja">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group")
      expect(details).toHaveAttribute("id", "kayttoohjeet-ja-tietoja")
    })

    it("uses custom ID when provided", () => {
      render(
        <Info title="Test Title" id="custom-id">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group")
      expect(details).toHaveAttribute("id", "custom-id")
    })

    it("handles Finnish characters in ID generation", () => {
      render(
        <Info title="Tietoja sovelluksesta ä ö å">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group")
      expect(details).toHaveAttribute("id", "tietoja-sovelluksesta-a-o-a")
    })
  })
})
