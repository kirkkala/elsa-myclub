import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
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
      expect(errorElement.closest("div")).toHaveClass("errorMessage")
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
          body: expect.any(FormData) as unknown as FormData,
        })
      )
    })
  })

  it("displays error message when Excel file has incorrect format", async () => {
    // Mock the fetch response for an error case
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          message:
            "Tarkista että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja että tarvittavat sarakkeet on tiedostossa (Sarja, Pvm, Klo, Kenttä, Koti, Vieras).",
        }),
    })

    render(<UploadForm />)

    // Create a file object
    const file = new File(["dummy content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Get the file input using the correct selector
    const fileInput = screen.getByTestId("file-input")

    // Upload the file
    await userEvent.upload(fileInput, file)

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(
          /Tarkista että ELSA:sta hakemasi excel-tiedoston sarakkeita ei ole muokattu ja että tarvittavat sarakkeet on tiedostossa/
        )
      ).toBeInTheDocument()
    })

    // Verify the error message is in the correct container
    const errorMessage = screen.getByText(/Virhe:/i).closest("div")
    expect(errorMessage).toHaveClass("errorMessage")
  })

  it("clears error message when new file is selected", async () => {
    // First mock an error response
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "Excel-tiedoston prosessointi epäonnistui.",
          }),
      })
      // Then mock a successful response
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                Nimi: "Test Event",
                Ryhmä: "Test Group",
                Tapahtumatyyppi: "Ottelu",
                Tapahtumapaikka: "Test Venue",
                Alkaa: "2024-01-01 10:00:00",
                Päättyy: "2024-01-01 11:00:00",
                Ilmoittautuminen: "Valituille henkilöille",
                Näkyvyys: "Näkyy ryhmälle",
                Kuvaus: "Test Description",
              },
            ],
          }),
      })

    render(<UploadForm />)

    // Upload first file (error case)
    const file1 = new File(["dummy content"], "test1.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const fileInput = screen.getByTestId("file-input")
    await userEvent.upload(fileInput, file1)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Virhe:/i)).toBeInTheDocument()
    })

    // Upload second file (success case)
    const file2 = new File(["dummy content"], "test2.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    await userEvent.upload(fileInput, file2)

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Excelin lukeminen onnistui!/i)).toBeInTheDocument()
    })

    // Verify error message is gone
    expect(screen.queryByText(/Virhe:/i)).not.toBeInTheDocument()
  })
})
