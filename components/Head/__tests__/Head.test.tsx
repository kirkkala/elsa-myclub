import { render } from "@testing-library/react"
import Head from "../Head"

jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/" }) }))
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
      <span data-testid="og-title">{openGraph?.title}</span>
      <span data-testid="og-description">{openGraph?.description}</span>
    </div>
  ),
}))

describe("Head", () => {
  it("uses default meta", () => {
    const { getByTestId } = render(<Head />)
    expect(getByTestId("title")).toHaveTextContent("eLSA → MyClub Muuntaja")
    expect(getByTestId("description")).toHaveTextContent(
      "Nettiappi eLSA excel tiedostojen muuntamiseen MyClub-yhteensopiviksi"
    )
  })

  it("uses custom props", () => {
    const { getByTestId } = render(
      <Head title="Custom" description="Custom Desc" ogTitle="OG" ogDescription="OG Desc" />
    )
    expect(getByTestId("title")).toHaveTextContent("Custom")
    expect(getByTestId("description")).toHaveTextContent("Custom Desc")
    expect(getByTestId("og-title")).toHaveTextContent("OG")
    expect(getByTestId("og-description")).toHaveTextContent("OG Desc")
  })
})
