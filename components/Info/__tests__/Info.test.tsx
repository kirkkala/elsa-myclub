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

    it("shows correct aria labels", () => {
      render(
        <Info title="Expandable Info">
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button")

      // Initially collapsed
      expect(button).toHaveAttribute("aria-label", "Näytä lisää")
      expect(button).toHaveAttribute("aria-expanded", "false")

      // After expanding
      fireEvent.click(button)
      expect(button).toHaveAttribute("aria-label", "Piilota")
      expect(button).toHaveAttribute("aria-expanded", "true")
    })
  })
})
