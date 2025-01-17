import { render, screen, fireEvent } from "@testing-library/react"
import FileUpload from "../FileUpload"

describe("FileUpload", () => {
  it("shows placeholder when no file selected", () => {
    render(<FileUpload selectedFile="" onChange={() => {}} />)
    expect(screen.getByText("Valitse tiedosto...")).toBeInTheDocument()
  })

  it("shows filename when file is selected", () => {
    render(<FileUpload selectedFile="test.xlsx" onChange={() => {}} />)
    expect(screen.getByText("test.xlsx")).toBeInTheDocument()
  })

  it("accepts excel file upload", () => {
    const handleChange = jest.fn()
    render(<FileUpload selectedFile="" onChange={handleChange} />)

    const file = new File([""], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const input = screen.getByTestId("file-input")

    fireEvent.change(input, { target: { files: [file] } })
    expect(handleChange).toHaveBeenCalled()
  })

  it("has correct file type restrictions", () => {
    const handleChange = jest.fn()
    render(<FileUpload selectedFile="" onChange={handleChange} />)
    const input = screen.getByTestId("file-input")

    // Verify accept attribute is set correctly
    expect(input).toHaveAttribute("accept", ".xlsx,.xls")

    // Verify required attribute is set
    expect(input).toBeRequired()
  })
})
