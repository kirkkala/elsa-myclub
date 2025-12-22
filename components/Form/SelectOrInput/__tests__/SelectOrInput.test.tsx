import { render, screen, fireEvent } from "@testing-library/react"
import { LuUser } from "react-icons/lu"
import SelectOrInput from "../SelectOrInput"

const mockProps = {
  id: "test",
  label: "Label",
  description: "Description",
  Icon: LuUser,
  required: true,
  options: [
    { value: "A", label: "Team A" },
    { value: "B", label: "Team B" },
  ],
  placeholder: "Placeholder",
  switchText: {
    toInput: { action: "To Input" },
    toList: { action: "To List" },
  },
}

describe("SelectOrInput", () => {
  it("renders select mode by default", () => {
    render(<SelectOrInput {...mockProps} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByText("Label")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("To Input")).toBeInTheDocument()
  })

  it("switches between modes correctly", () => {
    render(<SelectOrInput {...mockProps} />)

    // Switch to input
    fireEvent.click(screen.getByText("To Input"))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Placeholder")).toBeInTheDocument()
    expect(screen.getByText("To List")).toBeInTheDocument()

    // Switch back to select
    fireEvent.click(screen.getByText("To List"))
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("maintains required attribute in both modes", () => {
    render(<SelectOrInput {...mockProps} />)
    // MUI Select uses aria-required for required state
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-required", "true")

    fireEvent.click(screen.getByText("To Input"))
    expect(screen.getByRole("textbox")).toHaveAttribute("required")
  })

  it("handles disabled state correctly", () => {
    render(<SelectOrInput {...mockProps} disabled />)

    // Select should be disabled (MUI uses aria-disabled)
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true")

    // Switch link should still be in the DOM but visually disabled
    const switchButton = screen.getByRole("button", { name: /To Input/i })
    expect(switchButton).toBeInTheDocument()

    // Clicking disabled link should not switch modes
    fireEvent.click(switchButton)

    // Should still be in select mode (disabled links don't work)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("handles undefined disabled prop", () => {
    const propsWithoutDisabled = { ...mockProps }
    delete (propsWithoutDisabled as Record<string, unknown>).disabled

    render(<SelectOrInput {...propsWithoutDisabled} />)

    // Should not be disabled when disabled prop is undefined
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-disabled")
  })
})
