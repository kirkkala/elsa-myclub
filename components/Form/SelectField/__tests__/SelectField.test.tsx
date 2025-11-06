import { render, screen } from "@testing-library/react"
import { LuUser } from "react-icons/lu"
import SelectField from "../SelectField"

const mockProps = {
  id: "test",
  label: "Label",
  description: "Description",
  Icon: LuUser,
  options: [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3" }, // No label - tests value fallback
  ],
}

describe("SelectField", () => {
  it("renders with all elements", () => {
    render(<SelectField {...mockProps} />)
    expect(screen.getByLabelText("Label")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("opt3")).toBeInTheDocument() // Value used when no label
  })

  it("renders suffix and handles props", () => {
    render(<SelectField {...mockProps} suffix={<span>Suffix</span>} required className="custom" />)
    expect(screen.getByText("Suffix").parentElement).toHaveClass("suffix")
    expect(screen.getByRole("combobox")).toHaveAttribute("required")
    expect(screen.getByTestId("select-wrapper")).toHaveClass("custom")
  })
})
