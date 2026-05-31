import { render, screen, within } from "@testing-library/react"

import Info from "../../app/info/page"
import { testPageElements } from "../shared/page-elements.test"

describe("Info Page", () => {
  testPageElements(Info, {}, "/info")

  it("renders content sections", () => {
    render(<Info />)

    expect(screen.getByRole("heading", { name: "Tietoa sovelluksesta" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Lisätietoja ja palaute" })).toBeInTheDocument()
  })

  it("includes external links", () => {
    render(<Info />)

    expect(screen.getByRole("link", { name: "eLSA" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "MyClub" })).toBeInTheDocument()
  })

  it("has footer with author info", () => {
    render(<Info />)

    const footer = screen.getByRole("contentinfo")
    expect(within(footer).getByText(/Timo Kirkkala/)).toBeInTheDocument()
    expect(within(footer).getByRole("link", { name: /GitHub/i })).toBeInTheDocument()
  })
})
