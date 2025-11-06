import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Info from "../Info"

// Mock window.location and history
const mockLocation = {
  hash: "",
  pathname: "/test",
  search: "",
}

const mockHistory = {
  replaceState: jest.fn(),
}

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
})

Object.defineProperty(window, "history", {
  value: mockHistory,
  writable: true,
})

describe("Info component", () => {
  beforeEach(() => {
    mockLocation.hash = ""
    mockHistory.replaceState.mockClear()
  })

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

    it("opens section when ID is in URL hash on mount", () => {
      mockLocation.hash = "#test-section"

      render(
        <Info title="Test Section" id="test-section">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group") as HTMLDetailsElement
      expect(details.open).toBe(true)
    })

    it("opens section when generated ID is in URL hash", () => {
      mockLocation.hash = "#test-title"

      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group") as HTMLDetailsElement
      expect(details.open).toBe(true)
    })

    it("does not open section when ID is not in URL hash", () => {
      mockLocation.hash = "#other-section"

      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group") as HTMLDetailsElement
      expect(details.open).toBe(false)
    })

    it("updates URL hash when section is opened", async () => {
      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)

      // Wait for the setTimeout in handleToggle
      await waitFor(() => {
        expect(mockHistory.replaceState).toHaveBeenCalledWith(null, "", "#test-title")
      })
    })

    it("updates URL hash when section is closed", async () => {
      mockLocation.hash = "#test-title"

      render(
        <Info title="Test Title" defaultOpen>
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)

      // Wait for the setTimeout in handleToggle
      await waitFor(() => {
        expect(mockHistory.replaceState).toHaveBeenCalledWith(null, "", "/test")
      })
    })

    it("handles multiple sections in URL hash", () => {
      mockLocation.hash = "#section1,test-title,section3"

      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group") as HTMLDetailsElement
      expect(details.open).toBe(true)
    })

    it("removes section from hash when closing with other sections open", async () => {
      mockLocation.hash = "#section1,test-title,section3"

      render(
        <Info title="Test Title" defaultOpen>
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)

      // Wait for the setTimeout in handleToggle
      await waitFor(() => {
        expect(mockHistory.replaceState).toHaveBeenCalledWith(null, "", "#section1,section3")
      })
    })

    it("handles empty hash gracefully", () => {
      mockLocation.hash = ""

      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group") as HTMLDetailsElement
      expect(details.open).toBe(false)
    })
  })
})
