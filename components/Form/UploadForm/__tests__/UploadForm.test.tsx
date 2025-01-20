import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import UploadForm from "../UploadForm"

describe("UploadForm", () => {
  it("validates required fields and button state", () => {
    render(<UploadForm />)

    const previewButton = screen.getByRole("button", { name: /esikatsele/i })
    const groupInput = screen.getByLabelText(/joukkue/i)

    expect(previewButton).toBeDisabled()
    expect(groupInput).toBeRequired()
  })

  it("shows correct button state based on file selection", () => {
    render(<UploadForm />)
    const previewButton = screen.getByRole("button", { name: /esikatsele/i })
    expect(previewButton).toBeDisabled()

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

    expect(previewButton).not.toBeDisabled()
  })

  it("does not show download button before preview", () => {
    render(<UploadForm />)
    const downloadButton = screen.queryByRole("button", { name: /lataa excel/i })
    expect(downloadButton).not.toBeInTheDocument()
  })

  it("shows form fields with correct default values", () => {
    render(<UploadForm />)

    const currentYear = new Date().getFullYear().toString()

    expect(screen.getByLabelText(/vuosi/i)).toHaveValue(currentYear)
    expect(screen.getByLabelText(/kokoontumisaika/i)).toHaveValue("0")
    expect(screen.getByLabelText(/tapahtuman kesto/i)).toHaveValue("90")
    expect(screen.getByLabelText(/tapahtumatyyppi/i)).toHaveValue("Ottelu")
    expect(screen.getByLabelText(/ilmoittautuminen/i)).toHaveValue("Valituille henkilöille")
  })
})
