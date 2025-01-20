import { render, screen } from "@testing-library/react"
import { LuUser } from "react-icons/lu"
import SelectField from "../SelectField"

describe("SelectField", () => {
  const mockProps = {
    id: "test-select",
    label: "Test Label",
    description: "Test description",
    Icon: LuUser,
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2" },
    ],
  }

  it("renders select with all elements", () => {
    render(<SelectField {...mockProps} />)

    expect(screen.getByLabelText(/Test Label/i)).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
    expect(screen.getByText("Option 1")).toBeInTheDocument()
  })

  it("renders select option withou label", () => {
    render(<SelectField {...mockProps} />)

    expect(screen.getByLabelText(/Test Label/i)).toBeInTheDocument()
    expect(screen.getByText("option2")).toBeInTheDocument()
  })

  it("renders suffix when provided", () => {
    const suffix = <span>Test Suffix</span>
    render(<SelectField {...mockProps} suffix={suffix} />)

    expect(screen.getByText("Test Suffix")).toBeInTheDocument()
    expect(screen.getByText("Test Suffix").parentElement).toHaveClass("suffix")
  })

  it("handles required attribute", () => {
    render(<SelectField {...mockProps} required />)
    expect(screen.getByRole("combobox")).toHaveAttribute("required")
  })

  it("applies custom className when provided", () => {
    render(<SelectField {...mockProps} className="custom-class" />)
    expect(screen.getByTestId("select-wrapper")).toHaveClass("custom-class")
  })
})
