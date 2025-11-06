import { render, screen, fireEvent } from "@testing-library/react"
import { LuUser } from "react-icons/lu"
import TextInput from "../TextInput"

const mockProps = {
  id: "test",
  label: "Label",
  description: "Description",
  Icon: LuUser,
  placeholder: "Placeholder",
}

describe("TextInput", () => {
  it("renders with all elements", () => {
    render(<TextInput {...mockProps} />)
    expect(screen.getByLabelText("Label")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Placeholder")).toBeInTheDocument()
  })

  it("renders suffix", () => {
    render(<TextInput {...mockProps} suffix={<span>Suffix</span>} />)
    expect(screen.getByText("Suffix").parentElement).toHaveClass("suffix")
  })

  it("handles props correctly", () => {
    const onChange = jest.fn()
    render(<TextInput {...mockProps} required disabled defaultValue="test" onChange={onChange} />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("required")
    expect(input).toBeDisabled()
    expect(input).toHaveValue("test")

    fireEvent.change(input, { target: { value: "new" } })
    expect(onChange).toHaveBeenCalled()
  })

  it("handles missing description", () => {
    render(<TextInput {...mockProps} description={undefined} />)
    expect(screen.queryByText("Description")).not.toBeInTheDocument()
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby")
  })
})
