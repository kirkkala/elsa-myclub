import { render, screen } from "@testing-library/react"
import Docs from "../../pages/docs"
import { testPageElements } from "../shared/page-elements.test"

jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/docs" }) }))

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
})
