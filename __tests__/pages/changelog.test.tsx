import { render, screen } from "@testing-library/react"
import Changelog, { getStaticProps } from "../../pages/changelog"
import packageJson from "../../package.json"
import { testPageElements } from "../shared/page-elements.test"

jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/changelog" }) }))
jest.mock("fs", () => ({
  readFileSync: jest.fn(() =>
    jest
      .requireActual("fs")
      .readFileSync(jest.requireActual("path").join(process.cwd(), "CHANGELOG.md"), "utf8")
  ),
}))
jest.mock("gray-matter", () => (content: string) => ({ content, data: {} }))
jest.mock("remark", () => ({
  remark: () => ({
    use: () => ({ process: (content: string) => Promise.resolve({ toString: () => content }) }),
  }),
}))
jest.mock("remark-html", () => ({ default: () => ({}) }))

describe("Changelog", () => {
  testPageElements(Changelog, { contentHtml: "<h3>v1.0.0</h3><p>Test</p>" })

  it("renders content and matches package version", async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    expect(screen.getByText(/Versiohistoria/)).toBeInTheDocument()
    expect(screen.getAllByText(/v\d+\.\d+(\.\d+)?/).length).toBeGreaterThan(0)

    // Check version matches package.json
    const versionMatch = props.contentHtml.match(/v(\d+\.\d+(\.\d+)?)/)
    expect(versionMatch?.[1]).toBe(packageJson.version)
  })

  it("handles file read errors", async () => {
    require("fs").readFileSync.mockImplementationOnce(() => {
      throw new Error("File not found")
    })
    await expect(getStaticProps()).rejects.toThrow("File not found")
  })
})
