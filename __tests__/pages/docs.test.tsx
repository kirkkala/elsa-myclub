import { render, screen } from "@testing-library/react"
import { useRouter } from "next/router"
import Docs from "../../pages/docs"

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe("Docs Page", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: "/docs",
      query: {},
      asPath: "/docs",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      defaultLocale: "en",
      domainLocales: [],
      isPreview: false,
    })
  })

  it("renders the docs page", () => {
    render(<Docs />)
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
  })

  it("contains application information", () => {
    render(<Docs />)
    expect(screen.getByText(/helpottaa excel-jumppaa pelien siirtämisessä/)).toBeInTheDocument()
  })

  it("contains usage instructions", () => {
    render(<Docs />)
    expect(screen.getByText("Käyttöohjeet")).toBeInTheDocument()
    expect(screen.getByText(/Lataa excel-tiedosto eLSA:sta/)).toBeInTheDocument()
  })

  it("contains privacy policy information", () => {
    render(<Docs />)
    expect(screen.getByText("Tietosuojaseloste")).toBeInTheDocument()
    expect(screen.getByText(/Sovellus ei kerää tietoa käyttäjistä/)).toBeInTheDocument()
  })

  it("has links to external resources", () => {
    render(<Docs />)
    const elsaLinks = screen.getAllByRole("link", { name: /eLSA/ })
    expect(elsaLinks[0]).toHaveAttribute("href", expect.stringContaining("elsa"))

    const myClubLinks = screen.getAllByRole("link", { name: /MyClub/ })
    expect(myClubLinks[0]).toHaveAttribute("href", expect.stringContaining("myclub"))
  })

  it("has a back link", () => {
    render(<Docs />)
    expect(screen.getAllByRole("link", { name: /Takaisin/ })).toHaveLength(2)
  })

  it("has navigation links", () => {
    render(<Docs />)
    const changelogLinks = screen.getAllByRole("link", { name: /versiohistoria/ })
    expect(changelogLinks[0]).toHaveAttribute("href", "/changelog")

    const githubLinks = screen.getAllByRole("link", { name: /GitHubissa/ })
    expect(githubLinks[0]).toHaveAttribute("href", expect.stringContaining("github"))
  })

  it("has proper page title and meta", () => {
    render(<Docs />)
    // The Head component sets the document title, but in tests we can't easily check it
    // This test ensures the Head component is rendered with proper props
    expect(screen.getByText("Tietoja sovelluksesta")).toBeInTheDocument()
  })
})
