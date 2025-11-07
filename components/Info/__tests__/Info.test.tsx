import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Info from "../Info"

// Jest 30 compatible approach - mock history.replaceState only
const mockReplaceState = jest.fn()

describe("Info component", () => {
  beforeAll(() => {
    // Mock history.replaceState for Jest 30 compatibility
    Object.defineProperty(window.history, "replaceState", {
      value: mockReplaceState,
      writable: true,
      configurable: true,
    })
  })

  beforeEach(() => {
    mockReplaceState.mockClear()
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
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group")
      expect(details).toHaveAttribute("id", "test-title")
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
        <Info title="Käyttöohjeet">
          <div>Content</div>
        </Info>
      )

      const details = screen.getByRole("group")
      expect(details).toHaveAttribute("id", "kayttoohjeet")
    })

    it("renders in collapsed state by default (URL hash functionality tested in integration)", () => {
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
        expect(mockReplaceState).toHaveBeenCalledWith(null, "", "#test-title")
      })
    })

    it("calls history.replaceState when section is closed", async () => {
      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button")

      // First open the section
      fireEvent.click(button)

      // Then close it
      fireEvent.click(button)

      // Wait for the setTimeout in handleToggle
      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalled()
      })
    })
  })
})
