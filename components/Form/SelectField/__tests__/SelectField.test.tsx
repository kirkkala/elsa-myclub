import { render, screen, fireEvent } from "@testing-library/react"
import PersonIcon from "@mui/icons-material/Person"
import SelectField from "../SelectField"

const mockProps = {
  id: "test",
  label: "Label",
  description: "Description",
  Icon: PersonIcon,
  options: [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3" }, // No label - tests value fallback
  ],
  defaultValue: "opt1",
}

describe("SelectField", () => {
  it("renders with all elements", () => {
    render(<SelectField {...mockProps} />)
    expect(screen.getByText("Label")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    // MUI Select shows the selected value, not all options by default
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("renders suffix", () => {
    render(<SelectField {...mockProps} suffix={<span data-testid="suffix">Suffix</span>} />)
    expect(screen.getByTestId("suffix")).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<SelectField {...mockProps} disabled />)
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true")
  })

  it("calls onChange when selection changes", () => {
    const onChange = jest.fn()
    render(<SelectField {...mockProps} onChange={onChange} />)

    // Open the select
    const select = screen.getByRole("combobox")
    fireEvent.mouseDown(select)

    // Click on Option 2
    const option2 = screen.getByRole("option", { name: "Option 2" })
    fireEvent.click(option2)

    expect(onChange).toHaveBeenCalled()
  })
})
