import { render, screen, within } from "@testing-library/react"

import Docs from "../../app/docs/page"
import { testPageElements } from "../shared/page-elements.test"

describe("Docs Page", () => {
  testPageElements(Docs, {}, "/docs")

  it("renders the instructions section", () => {
    render(<Docs />)

    expect(screen.getByRole("heading", { name: "Käyttöohjeet" })).toBeInTheDocument()
    expect(screen.getByText("1. Hae ottelutiedosto eLSA:sta")).toBeInTheDocument()
  })

  it("includes external links", () => {
    render(<Docs />)

    expect(screen.getByRole("link", { name: "elsa.basket.fi" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Tapahtumien tuonti" })).toBeInTheDocument()
  })

  it("has footer with author info", () => {
    render(<Docs />)

    const footer = screen.getByRole("contentinfo")
    expect(within(footer).getByText(/Timo Kirkkala/)).toBeInTheDocument()
    expect(within(footer).getByRole("link", { name: /GitHub/i })).toBeInTheDocument()
  })
})
