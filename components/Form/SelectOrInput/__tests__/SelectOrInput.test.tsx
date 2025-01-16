import { render, screen, fireEvent } from "@testing-library/react"
import SelectOrInput from "../SelectOrInput"

const uiTexts = {
  label: "Test Label",
  description: "Test description",
  toInputAction: "Add custom text",
  toListAction: "Select from list",
  placeholder: "Enter custom value",
}

describe("SelectOrInput", () => {
  const mockProps = {
    id: "test-field",
    label: uiTexts.label,
    description: uiTexts.description,
    Icon: (): React.ReactElement => <span>icon</span>,
    options: [
      { value: "HNMKY Team A", label: "HNMKY Team A" },
      { value: "HNMKY Team B", label: "HNMKY Team B" },
    ],
    placeholder: uiTexts.placeholder,
    required: true,
    switchText: {
      toInput: {
        action: uiTexts.toInputAction,
      },
      toList: {
        action: uiTexts.toListAction,
      },
    },
  }

  it("renders select field by default with all elements", () => {
    render(<SelectOrInput {...mockProps} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByText(uiTexts.label)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.description)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.toInputAction)).toBeInTheDocument()
  })

  it("shows custom input with correct text when switching modes", () => {
    render(<SelectOrInput {...mockProps} />)

    // Check initial state
    expect(screen.getByRole("combobox")).toBeInTheDocument()

    // Switch to input
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(uiTexts.placeholder)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.toListAction)).toBeInTheDocument()
  })

  it("returns to select field when switching back", () => {
    render(<SelectOrInput {...mockProps} />)
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    fireEvent.click(screen.getByText(uiTexts.toListAction))
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("displays full team names in select options", () => {
    render(<SelectOrInput {...mockProps} />)
    expect(screen.getByText("HNMKY Team A")).toBeInTheDocument()
    expect(screen.getByText("HNMKY Team B")).toBeInTheDocument()
  })

  it("maintains required attribute in both modes", () => {
    render(<SelectOrInput {...mockProps} />)

    // Check select is required
    expect(screen.getByRole("combobox")).toHaveAttribute("required")

    // Switch to input and check
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    expect(screen.getByRole("textbox")).toHaveAttribute("required")
  })
})
