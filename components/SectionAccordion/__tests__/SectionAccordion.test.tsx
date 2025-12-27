import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import SectionAccordion from "../SectionAccordion"

const mockReplaceState = jest.fn()

describe("SectionAccordion component", () => {
  beforeAll(() => {
    Object.defineProperty(window.history, "replaceState", {
      value: mockReplaceState,
      writable: true,
      configurable: true,
    })
  })

  beforeEach(() => {
    mockReplaceState.mockClear()
  })

  describe("ID generation", () => {
    it("generates ID from title", () => {
      render(
        <SectionAccordion title="Test Title">
          <div>Content</div>
        </SectionAccordion>
      )

      expect(document.getElementById("test-title")).toBeInTheDocument()
    })

    it("uses custom ID when provided", () => {
      render(
        <SectionAccordion title="Test Title" id="custom-id">
          <div>Content</div>
        </SectionAccordion>
      )

      expect(document.getElementById("custom-id")).toBeInTheDocument()
    })

    it("handles Finnish characters", () => {
      render(
        <SectionAccordion title="Käyttöohjeet">
          <div>Content</div>
        </SectionAccordion>
      )

      expect(document.getElementById("kayttoohjeet")).toBeInTheDocument()
    })

    it("strips special characters", () => {
      render(
        <SectionAccordion title="Test & Title! With @#$% Special">
          <div>Content</div>
        </SectionAccordion>
      )

      expect(document.getElementById("test--title-with--special")).toBeInTheDocument()
    })
  })

  describe("URL hash synchronization", () => {
    it("updates URL hash when section is opened", async () => {
      render(
        <SectionAccordion title="Test Title">
          <div>Content</div>
        </SectionAccordion>
      )

      fireEvent.click(screen.getByRole("button", { name: /Test Title/i }))

      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalledWith(null, "", "#test-title")
      })
    })

    it("updates URL hash when section is closed", async () => {
      render(
        <SectionAccordion title="Test Title" defaultOpen>
          <div>Content</div>
        </SectionAccordion>
      )

      fireEvent.click(screen.getByRole("button", { name: /Test Title/i }))

      await waitFor(() => {
        expect(mockReplaceState).toHaveBeenCalled()
      })
    })
  })

  describe("defaultOpen prop", () => {
    it("starts expanded when defaultOpen is true", () => {
      render(
        <SectionAccordion title="Test Title" defaultOpen>
          <div>Content</div>
        </SectionAccordion>
      )

      expect(screen.getByRole("button", { name: /Test Title/i })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    })

    it("starts collapsed when defaultOpen is false", () => {
      render(
        <SectionAccordion title="Test Title" defaultOpen={false}>
          <div>Content</div>
        </SectionAccordion>
      )

      expect(screen.getByRole("button", { name: /Test Title/i })).toHaveAttribute(
        "aria-expanded",
        "false"
      )
    })
  })

  describe("non-expandable mode", () => {
    it("stays expanded and has no expand icon", () => {
      render(
        <SectionAccordion title="Test Title" expandable={false}>
          <div>Content</div>
        </SectionAccordion>
      )

      const button = screen.getByRole("button", { name: /Test Title/i })
      expect(button).toHaveAttribute("aria-expanded", "true")
      expect(button.querySelector("svg")).not.toBeInTheDocument()
    })
  })
})
