import { render, screen } from "@testing-library/react"
import Docs from "../../app/docs/page"
import { testPageElements } from "../shared/page-elements.test"

describe("Docs Page", () => {
  testPageElements(Docs)

  it("renders content and external links", () => {
    render(<Docs />)

    // Main content sections
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
    expect(screen.getByText(/eLSA → MyClub Muuntajan avulla/)).toBeInTheDocument()
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText(/Hae ottelut eLSA:sta/)).toBeInTheDocument()
    expect(screen.getByText("Tietosuojaseloste")).toBeInTheDocument()
    expect(screen.getByText(/Sovellus ei kerää tietoa käyttäjistä/)).toBeInTheDocument()

    // External links
    const elsaLink = screen.getAllByRole("link", { name: /eLSA/ })[0]
    const myclubLink = screen.getAllByRole("link", { name: /MyClub/ })[0]
    expect(elsaLink).toHaveAttribute("href", expect.stringContaining("elsa"))
    expect(myclubLink).toHaveAttribute("href", expect.stringContaining("myclub"))
  })

  it("has proper metadata structure", () => {
    render(<Docs />)

    // Check that all major sections are present
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText("Lisätietoja ja palaute")).toBeInTheDocument()
  })

  it("contains step-by-step instructions", () => {
    render(<Docs />)

    // Check for numbered instructions
    expect(screen.getByText(/Hae ottelut eLSA:sta/)).toBeInTheDocument()
    expect(screen.getByText(/Siirrä tiedosto sovellukseen/)).toBeInTheDocument()
    expect(screen.getByText(/Säädä asetukset/)).toBeInTheDocument()
    expect(screen.getByText(/Esikatsele muunnosta/)).toBeInTheDocument()
    expect(screen.getByText(/Lataa tiedosto/)).toBeInTheDocument()
    expect(screen.getByText(/Vie tiedosto MyClub:iin/)).toBeInTheDocument()
  })

  it("includes privacy information", () => {
    render(<Docs />)

    expect(screen.getByText("Tietosuojaseloste")).toBeInTheDocument()
    expect(screen.getByText(/Sovellus ei kerää tietoa käyttäjistä/)).toBeInTheDocument()
  })

  it("has contact information", () => {
    render(<Docs />)

    expect(screen.getByText(/timo.kirkkala@gmail.com/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /versiohistoria/ })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /GitHubissa/ })).toBeInTheDocument()
  })
})
