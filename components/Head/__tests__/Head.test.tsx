import { render, screen } from "@testing-library/react"
import CustomHead from "../Head"

jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/" }) }))
jest.mock("next/head", () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div data-testid="next-head">{children}</div>
  }
})

describe("Head", () => {
  it("renders without errors", () => {
    expect(() => render(<CustomHead />)).not.toThrow()
    expect(screen.getByTestId("next-head")).toBeInTheDocument()
  })

  it("renders with custom props without errors", () => {
    expect(() =>
      render(
        <CustomHead title="Custom" description="Custom Desc" ogTitle="OG" ogDescription="OG Desc" />
      )
    ).not.toThrow()
    expect(screen.getByTestId("next-head")).toBeInTheDocument()
  })
})
