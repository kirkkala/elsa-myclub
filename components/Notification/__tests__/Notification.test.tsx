import { render, screen } from "@testing-library/react"

import { NOTIFICATION } from "../../../config"
import Notification from "../Notification"

vi.mock("../../../config", () => ({
  NOTIFICATION: { enabled: false, severity: "warning", message: "" },
}))

// The component reads the (mocked) config object by reference, so we mutate it
// per test to exercise the different states.
const config = NOTIFICATION as {
  enabled: boolean
  severity: "alert" | "warning"
  message: string
}

describe("Notification", () => {
  afterEach(() => {
    config.enabled = false
    config.severity = "warning"
    config.message = ""
  })

  it("renders nothing when disabled", () => {
    config.enabled = false
    config.message = "Should not show"
    const { container } = render(<Notification />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when there is no message", () => {
    config.enabled = true
    config.message = ""
    const { container } = render(<Notification />)
    expect(container).toBeEmptyDOMElement()
  })

  it("shows the message when enabled", () => {
    config.enabled = true
    config.message = "Korjaus on tekeillä"
    render(<Notification />)
    expect(screen.getByText("Korjaus on tekeillä")).toBeInTheDocument()
  })

  it("renders HTML markup in the message", () => {
    config.enabled = true
    config.message = 'Katso <a href="https://example.com">lisätietoja</a>'
    render(<Notification />)
    expect(screen.getByRole("link", { name: "lisätietoja" })).toHaveAttribute(
      "href",
      "https://example.com"
    )
  })

  it("uses the error styling for the alert severity", () => {
    config.enabled = true
    config.severity = "alert"
    config.message = "Vakava virhe"
    render(<Notification />)
    expect(screen.getByRole("alert").className).toMatch(/Error/)
  })
})
