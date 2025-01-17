import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import UploadForm from "../UploadForm"

describe("UploadForm", () => {
  it("validates required fields and button state", () => {
    render(<UploadForm />)

    const submitButton = screen.getByRole("button", { name: /muunna tiedosto/i })
    const groupInput = screen.getByLabelText(/ryhmä/i)

    expect(submitButton).toBeDisabled()
    expect(groupInput).toBeRequired()
  })

  it("shows correct button state based on file selection", () => {
    render(<UploadForm />)
    const submitButton = screen.getByRole("button", { name: /muunna tiedosto/i })
    expect(submitButton).toBeDisabled()

    const fileInput = screen.getByTestId("file-input")
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File([""], "test.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        ],
      },
    })

    expect(submitButton).not.toBeDisabled()
  })
})
