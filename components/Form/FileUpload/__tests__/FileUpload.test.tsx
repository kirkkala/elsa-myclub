import { render, screen, fireEvent } from "@testing-library/react"
import FileUpload from "../FileUpload"

describe("FileUpload", () => {
  it("shows placeholder or filename", () => {
    const { rerender } = render(<FileUpload selectedFile="" onChange={() => {}} />)
    expect(screen.getByText("Valitse tiedosto...")).toBeInTheDocument()

    rerender(<FileUpload selectedFile="test.xlsx" onChange={() => {}} />)
    expect(screen.getByText("test.xlsx")).toBeInTheDocument()
  })

  it("handles file upload with correct restrictions", () => {
    const onChange = jest.fn()
    render(<FileUpload selectedFile="" onChange={onChange} />)

    const input = screen.getByTestId("file-input")
    expect(input).toHaveAttribute("accept", ".xlsx,.xls")
    expect(input).toBeRequired()

    const file = new File([""], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    fireEvent.change(input, { target: { files: [file] } })
    expect(onChange).toHaveBeenCalled()
  })
})
