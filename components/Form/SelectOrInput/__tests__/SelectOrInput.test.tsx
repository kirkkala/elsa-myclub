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
    expect(screen.getByText("A")).toBeInTheDocument() // Value is used when no label
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
    expect(screen.getByRole("combobox")).toHaveAttribute("required")

    fireEvent.click(screen.getByText("To Input"))
    expect(screen.getByRole("textbox")).toHaveAttribute("required")
  })
})
