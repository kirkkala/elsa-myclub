import { render, screen } from "@testing-library/react"
import { useRouter } from "next/router"
import Docs from "../../pages/docs"
import { testPageElements } from "../shared/page-elements.test"

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Test constants and patterns
const EXPECTED_CONTENT = {
  pageTitle: "Tietoja sovelluksesta",
  appDescription: /avulla siirrät pelit helposti/,
  usageTitle: "Käyttöohjeet",
  usageInstructions: /Lataa excel-tiedosto eLSA:sta/,
  privacyTitle: "Tietosuojaseloste",
  privacyInfo: /Sovellus ei kerää tietoa käyttäjistä/,
} as const

const EXPECTED_LINKS = {
  elsa: { name: /eLSA/, href: "elsa" },
  myclub: { name: /MyClub/, href: "myclub" },
  changelog: { name: /versiohistoria/, href: "/changelog" },
  github: { name: /GitHubissa/, href: "github" },
} as const

// Test helper functions
const setupDocsTest = () => {
  return render(<Docs />)
}

const expectElementsToBePresent = (patterns: readonly (string | RegExp)[]) => {
  patterns.forEach((pattern) => {
    if (typeof pattern === "string") {
      expect(screen.getByText(pattern)).toBeInTheDocument()
    } else {
      expect(screen.getByText(pattern)).toBeInTheDocument()
    }
  })
}

const expectLinkWithHref = (linkPattern: RegExp, hrefContains: string) => {
  const links = screen.getAllByRole("link", { name: linkPattern })
  expect(links[0]).toHaveAttribute("href", expect.stringContaining(hrefContains))
}

describe("Docs Page", () => {
  // Test generic page elements
  testPageElements(Docs)

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: "/docs",
      route: "/docs",
      query: {},
      asPath: "/docs",
      basePath: "",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
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
    setupDocsTest()
    expectElementsToBePresent([EXPECTED_CONTENT.pageTitle])
  })

  it("contains application information", () => {
    setupDocsTest()
    expectElementsToBePresent([EXPECTED_CONTENT.appDescription])
  })

  it("contains usage instructions", () => {
    setupDocsTest()
    expectElementsToBePresent([EXPECTED_CONTENT.usageTitle, EXPECTED_CONTENT.usageInstructions])
  })

  it("contains privacy policy information", () => {
    setupDocsTest()
    expectElementsToBePresent([EXPECTED_CONTENT.privacyTitle, EXPECTED_CONTENT.privacyInfo])
  })

  it("has links to external resources", () => {
    setupDocsTest()
    expectLinkWithHref(EXPECTED_LINKS.elsa.name, EXPECTED_LINKS.elsa.href)
    expectLinkWithHref(EXPECTED_LINKS.myclub.name, EXPECTED_LINKS.myclub.href)
  })

  it("has navigation links", () => {
    setupDocsTest()
    expectLinkWithHref(EXPECTED_LINKS.changelog.name, EXPECTED_LINKS.changelog.href)
    expectLinkWithHref(EXPECTED_LINKS.github.name, EXPECTED_LINKS.github.href)
  })
})
