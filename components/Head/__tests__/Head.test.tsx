import { render } from "@testing-library/react"
import { useRouter } from "next/router"
import Head from "../Head"

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

// Mock next-seo
jest.mock("next-seo", () => ({
  NextSeo: ({
    title,
    description,
    openGraph,
  }: {
    title?: string
    description?: string
    openGraph?: { title?: string; description?: string }
  }) => (
    <div data-testid="next-seo">
      <span data-testid="title">{title}</span>
      <span data-testid="description">{description}</span>
      <span data-testid="og-title">{openGraph.title}</span>
      <span data-testid="og-description">{openGraph.description}</span>
    </div>
  ),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe("Head component", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: "/",
      route: "/",
      query: {},
      asPath: "/",
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

  it("uses default home page meta when no props provided", () => {
    mockUseRouter.mockReturnValue({
      ...mockUseRouter(),
      pathname: "/",
    })

    const { getByTestId } = render(<Head />)

    expect(getByTestId("title")).toHaveTextContent("eLSA → MyClub Muuntaja")
    expect(getByTestId("description")).toHaveTextContent(
      "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi"
    )
  })

  it("uses page-specific meta for docs page", () => {
    mockUseRouter.mockReturnValue({
      ...mockUseRouter(),
      pathname: "/docs",
    })

    const { getByTestId } = render(<Head />)

    expect(getByTestId("title")).toHaveTextContent("eLSA → MyClub Muuntaja")
  })

  it("uses page-specific meta for changelog page", () => {
    mockUseRouter.mockReturnValue({
      ...mockUseRouter(),
      pathname: "/changelog",
    })

    const { getByTestId } = render(<Head />)

    expect(getByTestId("title")).toHaveTextContent("eLSA → MyClub Muuntaja")
  })

  it("falls back to home meta for unknown pages", () => {
    mockUseRouter.mockReturnValue({
      ...mockUseRouter(),
      pathname: "/unknown-page",
    })

    const { getByTestId } = render(<Head />)

    expect(getByTestId("title")).toHaveTextContent("eLSA → MyClub Muuntaja")
    expect(getByTestId("description")).toHaveTextContent(
      "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi"
    )
  })

  it("uses provided props over default meta", () => {
    const { getByTestId } = render(
      <Head
        title="Custom Title"
        description="Custom Description"
        ogTitle="Custom OG Title"
        ogDescription="Custom OG Description"
      />
    )

    expect(getByTestId("title")).toHaveTextContent("Custom Title")
    expect(getByTestId("description")).toHaveTextContent("Custom Description")
    expect(getByTestId("og-title")).toHaveTextContent("Custom OG Title")
    expect(getByTestId("og-description")).toHaveTextContent("Custom OG Description")
  })

  it("uses partial props with defaults", () => {
    const { getByTestId } = render(<Head title="Custom Title Only" />)

    expect(getByTestId("title")).toHaveTextContent("Custom Title Only")
    expect(getByTestId("description")).toHaveTextContent(
      "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi"
    )
  })
})
