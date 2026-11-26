import { render, screen } from "@testing-library/react"

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
})
