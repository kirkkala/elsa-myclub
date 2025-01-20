import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import UploadForm from "../UploadForm"

// Mock fetch globally
global.fetch = jest.fn()

describe("UploadForm", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ /* mock data structure */ }] })
    })
  })

  it("validates file input", () => {
    render(<UploadForm />)
    const groupInput = screen.getByLabelText(/joukkue/i)
    expect(groupInput).not.toBeRequired()
  })

  it("shows correct button state based on file selection", async () => {
    render(<UploadForm />)
    const downloadButton = screen.queryByRole("button", { name: /lataa excel/i })
    expect(downloadButton).not.toBeInTheDocument()

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

    // Wait for the preview data to load and button to appear
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /lataa excel/i })).toBeInTheDocument()
    })
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
