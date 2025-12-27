import { render, screen, fireEvent } from "@testing-library/react"

import Docs from "../../app/docs/page"
import { testPageElements } from "../shared/page-elements.test"

describe("Docs Page", () => {
  testPageElements(Docs)

  it("renders content and external links", () => {
    render(<Docs />)

    // Main content sections (accordions)
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText("Lisätietoja ja palaute")).toBeInTheDocument()
  })

  it("has proper metadata structure", () => {
    render(<Docs />)

    // Check that all major sections are present
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText("Lisätietoja ja palaute")).toBeInTheDocument()
  })

  it("includes external links when accordion is expanded", () => {
    render(<Docs />)

    // First expand the "Tietoja sovelluksesta" accordion to access its links
    const tietojaButton = screen.getByRole("button", { name: /Tietoja sovelluksesta/i })
    fireEvent.click(tietojaButton)

    // External links should be present after expanding the accordion
    expect(screen.getByRole("link", { name: /eLSA/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /MyClub/i })).toBeInTheDocument()
  })

  it("has footer with author info", () => {
    render(<Docs />)

    expect(screen.getByText(/Timo Kirkkala/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument()
  })
})
