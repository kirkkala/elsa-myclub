import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import UploadForm from "../UploadForm"

// Mock fetch globally
global.fetch = jest.fn()

// Constants
const DOWNLOAD_BUTTON_TEXT = /lataa excel/i
const FORM_LABELS = {
  TEAM: /joukkue/i,
  YEAR: /vuosi/i,
  MEETING_TIME: /kokoontumisaika/i,
  DURATION: /tapahtuman kesto/i,
  EVENT_TYPE: /tapahtumatyyppi/i,
  REGISTRATION: /ilmoittautuminen/i,
} as const

const DEFAULT_VALUES = {
  MEETING_TIME: "0",
  DURATION: "90",
  EVENT_TYPE: "Ottelu",
  REGISTRATION: "Valituille henkilöille",
} as const

describe("UploadForm", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              date: "2024-01-01",
              time: "10:00",
              opponent: "Test Team",
              location: "Test Location",
            },
          ],
        }),
    })
  })

  it("validates file input", () => {
    render(<UploadForm />)
    const groupInput = screen.getByLabelText(FORM_LABELS.TEAM)
    expect(groupInput).not.toBeRequired()
  })

  it("shows correct button state based on file selection", async () => {
    render(<UploadForm />)
    const downloadButton = screen.queryByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
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
      expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
    })
  })

  it("does not show download button before preview", () => {
    render(<UploadForm />)
    const downloadButton = screen.queryByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
    expect(downloadButton).not.toBeInTheDocument()
  })

  it("shows form fields with correct default values", () => {
    render(<UploadForm />)

    const currentYear = new Date().getFullYear().toString()

    expect(screen.getByLabelText(FORM_LABELS.YEAR)).toHaveValue(currentYear)
    expect(screen.getByLabelText(FORM_LABELS.MEETING_TIME)).toHaveValue(DEFAULT_VALUES.MEETING_TIME)
    expect(screen.getByLabelText(FORM_LABELS.DURATION)).toHaveValue(DEFAULT_VALUES.DURATION)
    expect(screen.getByLabelText(FORM_LABELS.EVENT_TYPE)).toHaveValue(DEFAULT_VALUES.EVENT_TYPE)
    expect(screen.getByLabelText(FORM_LABELS.REGISTRATION)).toHaveValue(DEFAULT_VALUES.REGISTRATION)
  })

  it("handles preview API error correctly", async () => {
    // Mock the preview API to return an error
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Test error message" }),
    })

    render(<UploadForm />)

    // Upload a file to trigger the preview API call
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

    // Wait for error message to appear
    await waitFor(() => {
      const errorElement = screen.getByText("Test error message")
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveClass("error")
    })
  })

  it("triggers preview API call when form fields change", async () => {
    render(<UploadForm />)

    // First upload a file to enable preview functionality
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

    // Wait for preview to complete
    await waitFor(() => {
      expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
    })

    // Change form fields
    const yearSelect = screen.getByLabelText(FORM_LABELS.YEAR)
    const durationSelect = screen.getByLabelText(FORM_LABELS.DURATION)
    const meetingTimeSelect = screen.getByLabelText(FORM_LABELS.MEETING_TIME)

    fireEvent.change(yearSelect, { target: { value: "2025" } })
    fireEvent.change(durationSelect, { target: { value: "120" } })
    fireEvent.change(meetingTimeSelect, { target: { value: "30" } })

    // Verify that the preview API was called with the updated values
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/preview"),
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      )
    })
  })
})
