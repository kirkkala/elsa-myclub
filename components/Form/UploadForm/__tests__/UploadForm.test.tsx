import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import UploadForm from "../UploadForm"
import { EXCEL_VALIDATION_ERROR } from "@/utils/error"

// Mock fetch globally
global.fetch = jest.fn()

// Test constants
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

// Test helpers
const createMockExcelFile = (name = "test.xlsx", content = "") =>
  new File([content], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

const mockSuccessfulPreviewResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      data: [
        {
          Nimi: "Test Event",
          Ryhmä: "Test Group",
          Tapahtumatyyppi: "Ottelu",
          Tapahtumapaikka: "Namika Areena LIIKE ON LÄÄKE B",
          Alkaa: "2024-01-01 10:00:00",
          Päättyy: "2024-01-01 11:00:00",
          Ilmoittautuminen: "Valituille henkilöille",
          Näkyvyys: "Näkyy ryhmälle",
          Kuvaus: "Test Description",
        },
      ],
    }),
}

const uploadFileAndWaitForPreview = async (fileName?: string) => {
  const fileInput = screen.getByTestId("file-input")
  fireEvent.change(fileInput, {
    target: { files: [createMockExcelFile(fileName)] },
  })

  await waitFor(() => {
    expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
  })
}

const uploadFile = (fileName = "test.xlsx", content = "") => {
  const fileInput = screen.getByTestId("file-input")
  fireEvent.change(fileInput, {
    target: { files: [createMockExcelFile(fileName, content)] },
  })
}

const mockDownloadEnvironment = () => {
  const mockClick = jest.fn()
  const originalCreateElement = document.createElement
  const originalAppendChild = document.body.appendChild

  document.createElement = jest.fn().mockReturnValue({
    href: "",
    download: "",
    click: mockClick,
    remove: jest.fn(),
  })
  document.body.appendChild = jest.fn()

  return {
    mockClick,
    restore: () => {
      document.createElement = originalCreateElement
      document.body.appendChild = originalAppendChild
    },
  }
}

describe("UploadForm", () => {
  // Mock URL methods
  const mockCreateObjectURL = jest.fn()
  const mockRevokeObjectURL = jest.fn()

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()

    // Mock URL methods
    Object.defineProperty(window, "URL", {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
      writable: true,
    })

    mockCreateObjectURL.mockReturnValue("blob:test-url")
    // Set default successful response
    ;(global.fetch as jest.Mock).mockResolvedValue(mockSuccessfulPreviewResponse)
  })

  afterEach(() => {
    // Clean up any DOM modifications
    jest.restoreAllMocks()
  })

  it("validates file input", () => {
    render(<UploadForm />)
    const groupInput = screen.getByLabelText(FORM_LABELS.TEAM)
    expect(groupInput).not.toBeRequired()
  })

  it("shows download button after successful file upload", async () => {
    render(<UploadForm />)

    // Initially no download button
    expect(screen.queryByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).not.toBeInTheDocument()

    // Upload file and wait for preview
    await uploadFileAndWaitForPreview()

    // Download button should now be visible
    expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
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
    uploadFile()

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
    await uploadFileAndWaitForPreview()

    // Change form fields
    const yearSelect = screen.getByLabelText(FORM_LABELS.YEAR)
    const durationSelect = screen.getByLabelText(FORM_LABELS.DURATION)
    const meetingTimeSelect = screen.getByLabelText(FORM_LABELS.MEETING_TIME)

    fireEvent.change(yearSelect, { target: { value: "2025" } })
    fireEvent.change(durationSelect, { target: { value: "120" } })
    fireEvent.change(meetingTimeSelect, { target: { value: "30" } })

    // Verify that the preview API was called with the updated values
    await waitFor(() => {
      interface FetchCallParams {
        method: "POST"
        body: FormData
      }
      type FetchCall = [string, FetchCallParams]
      const mockFetch = global.fetch as jest.Mock<Promise<Response>, [string, FetchCallParams]>
      const fetchCall = mockFetch.mock.calls[1] as FetchCall
      expect(fetchCall[0]).toBe("/api/preview")
      expect(fetchCall[1]).toEqual({
        method: "POST",
        body: expect.any(FormData) as unknown as FormData,
      })
    })
  })

  it("displays error message when Excel file has incorrect format", async () => {
    // Mock the fetch response for an error case
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          message: EXCEL_VALIDATION_ERROR,
        }),
    })

    render(<UploadForm />)

    // Upload the file
    await userEvent.upload(
      screen.getByTestId("file-input"),
      createMockExcelFile("test.xlsx", "dummy content")
    )

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(EXCEL_VALIDATION_ERROR)).toBeInTheDocument()
    })

    // Verify the error message is in the correct container
    const errorMessage = screen.getByText(/Virhe:/i).closest("div")
    expect(errorMessage).toHaveClass("errorMessage")
  })

  it("clears error message when new file is selected", async () => {
    // First mock an error response, then a successful response
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "Excel-tiedoston prosessointi epäonnistui." }),
      })
      .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

    render(<UploadForm />)
    const fileInput = screen.getByTestId("file-input")

    // Upload first file (error case)
    await userEvent.upload(fileInput, createMockExcelFile("test1.xlsx", "dummy content"))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Virhe:/i)).toBeInTheDocument()
    })

    // Upload second file (success case)
    await userEvent.upload(fileInput, createMockExcelFile("test2.xlsx", "dummy content"))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Excelin luku onnistui!/i)).toBeInTheDocument()
    })

    // Verify error message is gone
    expect(screen.queryByText(/Virhe:/i)).not.toBeInTheDocument()
  })

  it("does not trigger preview when changing fields without file", () => {
    render(<UploadForm />)

    const yearSelect = screen.getByLabelText(FORM_LABELS.YEAR)
    fireEvent.change(yearSelect, { target: { value: "2025" } })

    // Should not call fetch since no file is selected
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("handles download functionality", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await uploadFileAndWaitForPreview()

    // Mock successful download response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () =>
        Promise.resolve(
          new Blob(["test"], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        ),
    })

    // Mock DOM methods for download
    const downloadMock = mockDownloadEnvironment()

    // Trigger download
    const downloadButton = screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
    fireEvent.click(downloadButton)

    // Verify download was triggered
    await waitFor(() => {
      expect(downloadMock.mockClick).toHaveBeenCalled()
    })

    // Restore DOM methods
    downloadMock.restore()
  })
})
