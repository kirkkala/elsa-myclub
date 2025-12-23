import { render, screen, fireEvent } from "@testing-library/react"
import FileUpload from "../FileUpload"

const mockProps = {
  label: "eLSA excel tiedosto",
  description: "Valitse Excel tiedosto",
  selectedFile: "",
  onChange: jest.fn(),
}

describe("FileUpload", () => {
  it("renders label and description", () => {
    render(<FileUpload {...mockProps} />)
    expect(screen.getByText("eLSA excel tiedosto")).toBeInTheDocument()
    expect(screen.getByText("Valitse Excel tiedosto")).toBeInTheDocument()
  })

  it("shows placeholder or filename", () => {
    const { rerender } = render(<FileUpload {...mockProps} />)
    expect(screen.getByText("Valitse tiedosto...")).toBeInTheDocument()

    rerender(<FileUpload {...mockProps} selectedFile="test.xlsx" />)
    expect(screen.getByText("test.xlsx")).toBeInTheDocument()
  })

  it("handles file upload with correct restrictions", () => {
    const onChange = jest.fn()
    render(<FileUpload {...mockProps} onChange={onChange} />)

    const input = screen.getByTestId("file-input")
    expect(input).toHaveAttribute("accept", ".xlsx,.xls")
    expect(input).toBeRequired()

    const file = new File([""], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    fireEvent.change(input, { target: { files: [file] } })
    expect(onChange).toHaveBeenCalled()
  })

  it("has proper accessibility attributes", () => {
    render(<FileUpload {...mockProps} />)
    const input = screen.getByTestId("file-input")
    expect(input).toHaveAttribute("aria-label", mockProps.label)
  })
})
