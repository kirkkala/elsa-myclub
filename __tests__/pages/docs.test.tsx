import { render, screen, within } from "@testing-library/react"

import Docs from "../../app/docs/page"
import { testPageElements } from "../shared/page-elements.test"

describe("Docs Page", () => {
  testPageElements(Docs)

  it("renders content sections", () => {
    render(<Docs />)

    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText("Lisätietoja ja palaute")).toBeInTheDocument()
  })

  it("includes external links", () => {
    render(<Docs />)

    expect(screen.getByRole("link", { name: "eLSA" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "MyClub" })).toBeInTheDocument()
  })

  it("has footer with author info", () => {
    render(<Docs />)

    const footer = screen.getByRole("contentinfo")
    expect(within(footer).getByText(/Timo Kirkkala/)).toBeInTheDocument()
    expect(within(footer).getByRole("link", { name: /GitHub/i })).toBeInTheDocument()
  })
})
