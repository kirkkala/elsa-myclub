import PersonIcon from "@mui/icons-material/Person"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

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
    expect(screen.getByLabelText("Label")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("handles disabled state", () => {
    render(<SelectField {...mockProps} disabled />)
    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  it("calls onChange when selection changes", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<SelectField {...mockProps} onChange={onChange} />)

    // Open the autocomplete
    const combobox = screen.getByRole("combobox")
    await user.click(combobox)

    // Click on Option 2
    const option2 = screen.getByRole("option", { name: "Option 2" })
    await user.click(option2)

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        target: expect.objectContaining({
          name: "test",
          value: "opt2",
        }),
      })
    )
  })

  it("allows searching/filtering options", async () => {
    const user = userEvent.setup()
    render(<SelectField {...mockProps} />)

    const combobox = screen.getByRole("combobox")
    await user.type(combobox, "Option 2")

    // Should only show Option 2
    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Option 2")
  })
})
