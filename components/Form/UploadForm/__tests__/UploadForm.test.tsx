import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import UploadForm from "../UploadForm"
import { EXCEL_VALIDATION_ERROR } from "@/utils/error"

// Mock fetch globally
global.fetch = jest.fn()

// Test constants
const DOWNLOAD_BUTTON_TEXT = /lataa excel/i

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

  it("renders all form elements", () => {
    render(<UploadForm />)
    // Check for form field labels - use more specific patterns
    expect(screen.getByText(/1\. Joukkue/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. Vuosi/i)).toBeInTheDocument()
    expect(screen.getByText(/3\. Kokoontumisaika/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. Tapahtuman kesto/i)).toBeInTheDocument()
    expect(screen.getByText(/5\. Tapahtumatyyppi/i)).toBeInTheDocument()
    expect(screen.getByText(/6\. Ilmoittautuminen/i)).toBeInTheDocument()
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
      expect(screen.getByText("Test error message")).toBeInTheDocument()
    })
  })

  it("triggers preview API call when form fields change after file upload", async () => {
    render(<UploadForm />)

    // First upload a file to enable preview functionality
    await uploadFileAndWaitForPreview()

    // Find comboboxes by their roles
    const comboboxes = screen.getAllByRole("combobox")
    expect(comboboxes.length).toBeGreaterThan(0)

    // The first call was the initial preview, clear that
    ;(global.fetch as jest.Mock).mockClear()
    ;(global.fetch as jest.Mock).mockResolvedValue(mockSuccessfulPreviewResponse)

    // Open a dropdown and change value
    fireEvent.mouseDown(comboboxes[1]) // Year dropdown

    // Find and click an option
    const listbox = within(screen.getByRole("listbox"))
    const nextYearOption = listbox.getByText(String(new Date().getFullYear() + 1))
    fireEvent.click(nextYearOption)

    // Verify that the preview API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
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
      expect(screen.getByText(/Virhe/i)).toBeInTheDocument()
    })

    // Upload second file (success case)
    await userEvent.upload(fileInput, createMockExcelFile("test2.xlsx", "dummy content"))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Excelin luku onnistui!/i)).toBeInTheDocument()
    })

    // Verify error message is gone
    expect(screen.queryByText(/Virhe/i)).not.toBeInTheDocument()
  })

  it("does not trigger preview when changing fields without file", () => {
    render(<UploadForm />)

    // Fields are disabled when no file is selected
    const comboboxes = screen.getAllByRole("combobox")
    // Try to interact with a combobox - it should be disabled
    expect(comboboxes[1]).toHaveAttribute("aria-disabled", "true") // Year dropdown

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

  it("handles download API error", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await uploadFileAndWaitForPreview()

    // Mock download API error
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Download failed" }),
    })

    // Trigger download
    const downloadButton = screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
    fireEvent.click(downloadButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Download failed")).toBeInTheDocument()
    })
  })

  it("handles network error during preview", async () => {
    render(<UploadForm />)

    // Mock network error
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    // Upload file
    uploadFile()

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it("handles network error during download", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await uploadFileAndWaitForPreview()

    // Mock network error for download
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Download network error"))

    // Trigger download
    const downloadButton = screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
    fireEvent.click(downloadButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Download network error/)).toBeInTheDocument()
    })
  })

  it("handles multiple file uploads correctly", async () => {
    render(<UploadForm />)

    // Upload first file
    await uploadFileAndWaitForPreview("first.xlsx")
    expect(screen.getByText(/Excelin luku onnistui!/)).toBeInTheDocument()

    // Upload second file - should clear previous state
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessfulPreviewResponse)
    uploadFile("second.xlsx")

    // Wait for new preview to load
    await waitFor(() => {
      expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
    })
  })

  it("shows loading state during download", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await uploadFileAndWaitForPreview()

    // Mock delayed download response
    let resolveDownload: (_response: Response) => void
    const delayedDownload = new Promise<Response>((resolve) => {
      resolveDownload = resolve
    })
    ;(global.fetch as jest.Mock).mockReturnValueOnce(delayedDownload)

    // Trigger download
    const downloadButton = screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })
    fireEvent.click(downloadButton)

    // Check loading state
    await waitFor(() => {
      expect(downloadButton).toBeDisabled()
    })

    // Resolve the download
    resolveDownload!({
      ok: true,
      blob: () => Promise.resolve(new Blob(["test"])),
    } as Response)

    // Wait for loading to finish
    await waitFor(() => {
      expect(downloadButton).not.toBeDisabled()
    })
  })

  it("handles empty file selection", () => {
    render(<UploadForm />)

    const fileInput = screen.getByTestId("file-input")

    // Simulate selecting no files
    fireEvent.change(fileInput, { target: { files: [] } })

    // Should not trigger any API calls
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("resets success state when new file is selected", async () => {
    render(<UploadForm />)

    // Upload first file successfully
    await uploadFileAndWaitForPreview()

    // Verify success state
    expect(screen.getByText(/Excelin luku onnistui!/)).toBeInTheDocument()

    // Upload second file
    uploadFile("second-file.xlsx")

    // Success message should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/Excelin luku onnistui!/)).not.toBeInTheDocument()
    })
  })
})
