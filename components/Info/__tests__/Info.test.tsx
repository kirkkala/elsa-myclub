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

      // Non-expandable info should not have an accordion button
      expect(screen.queryByRole("button", { expanded: false })).not.toBeInTheDocument()
    })
  })

  describe("Expandable info (MUI Accordion)", () => {
    it("renders collapsed by default", () => {
      render(
        <Info title="Expandable Info">
          <div>Hidden Content</div>
        </Info>
      )

      // The accordion button should indicate it's collapsed
      const button = screen.getByRole("button", { name: /Expandable Info/i })
      expect(button).toHaveAttribute("aria-expanded", "false")
    })

    it("expands and collapses on click", () => {
      render(
        <Info title="Expandable Info">
          <div>Toggle Content</div>
        </Info>
      )

      const button = screen.getByRole("button", { name: /Expandable Info/i })

      // Initially collapsed
      expect(button).toHaveAttribute("aria-expanded", "false")

      // Click to expand
      fireEvent.click(button)
      expect(button).toHaveAttribute("aria-expanded", "true")

      // Click to collapse
      fireEvent.click(button)
      expect(button).toHaveAttribute("aria-expanded", "false")
    })

    it("has correct ID", () => {
      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      // MUI Accordion uses the ID on the container element
      const accordion = document.getElementById("test-title")
      expect(accordion).toBeInTheDocument()
    })

    it("uses custom ID when provided", () => {
      render(
        <Info title="Test Title" id="custom-id">
          <div>Content</div>
        </Info>
      )

      const accordion = document.getElementById("custom-id")
      expect(accordion).toBeInTheDocument()
    })

    it("handles Finnish characters in ID generation", () => {
      render(
        <Info title="Käyttöohjeet">
          <div>Content</div>
        </Info>
      )

      const accordion = document.getElementById("kayttoohjeet")
      expect(accordion).toBeInTheDocument()
    })

    it("updates URL hash when section is opened", async () => {
      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button", { name: /Test Title/i })
      fireEvent.click(button)

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

      const button = screen.getByRole("button", { name: /Test Title/i })

      // First open the section
      fireEvent.click(button)

      // Then close it
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalled()
      })
    })

    it("respects defaultOpen prop", () => {
      render(
        <Info title="Test Title" defaultOpen>
          <div>Initially Visible Content</div>
        </Info>
      )

      // Content should be visible initially
      expect(screen.getByText("Initially Visible Content")).toBeInTheDocument()

      const button = screen.getByRole("button", { name: /Test Title/i })
      expect(button).toHaveAttribute("aria-expanded", "true")
    })

    it("handles defaultOpen false explicitly", () => {
      render(
        <Info title="Test Title" defaultOpen={false}>
          <div>Initially Hidden Content</div>
        </Info>
      )

      const button = screen.getByRole("button", { name: /Test Title/i })
      expect(button).toHaveAttribute("aria-expanded", "false")
    })

    it("handles special characters in title for ID generation", () => {
      render(
        <Info title="Test & Title! With @#$% Special Characters">
          <div>Content</div>
        </Info>
      )

      const accordion = document.getElementById("test--title-with--special-characters")
      expect(accordion).toBeInTheDocument()
    })

    it("handles empty title for ID generation", () => {
      render(
        <Info title="">
          <div>Content</div>
        </Info>
      )

      // With empty title, the component should still render the content
      expect(screen.getByText("Content")).toBeInTheDocument()
    })

    it("shows expand icon", () => {
      render(
        <Info title="Test Title">
          <div>Content</div>
        </Info>
      )

      const button = screen.getByRole("button", { name: /Test Title/i })
      expect(button.querySelector("svg")).toBeInTheDocument()
    })
  })
})
