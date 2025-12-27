import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"

import { EXCEL_VALIDATION_ERROR } from "@/utils/error"

import UploadForm from "../UploadForm"

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

const dropFiles = (files: File[]) => {
  const dropzone = screen.getByTestId("dropzone")
  fireEvent.drop(dropzone, {
    dataTransfer: {
      files,
      types: ["Files"],
    },
  })
}

const dropFilesAndWaitForPreview = async (files: File[]) => {
  dropFiles(files)
  await waitFor(() => {
    expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
  })
}

const mockDownloadEnvironment = () => {
  const mockClick = jest.fn()
  /* eslint-disable @typescript-eslint/no-deprecated */
  const originalCreateElement = document.createElement.bind(document)
  const originalAppendChild = document.body.appendChild.bind(document.body)

  document.createElement = jest.fn().mockReturnValue({
    href: "",
    download: "",
    click: mockClick,
    remove: jest.fn(),
  }) as typeof document.createElement
  document.body.appendChild = jest.fn() as typeof document.body.appendChild

  return {
    mockClick,
    restore: () => {
      document.createElement = originalCreateElement
      document.body.appendChild = originalAppendChild
    },
  }
  /* eslint-enable @typescript-eslint/no-deprecated */
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
    // Check for form field labels using getAllByText since MUI renders labels in multiple places
    expect(screen.getAllByText(/1\. Joukkue/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2\. Vuosi/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/3\. Kokoontumisaika/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/4\. Tapahtuman kesto/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/5\. Tapahtumatyyppi/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/6\. Ilmoittautuminen/i).length).toBeGreaterThan(0)
  })

  it("renders dropzone with instructions", () => {
    render(<UploadForm />)
    expect(
      screen.getByText("Pudota eLSA:sta haetut excel-tiedostot tai klikkaa valitaksesi")
    ).toBeInTheDocument()
  })

  it("shows download button after successful file upload", async () => {
    render(<UploadForm />)

    // Initially no download button
    expect(screen.queryByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).not.toBeInTheDocument()

    // Upload file and wait for preview
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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
    dropFiles([createMockExcelFile()])

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Test error message")).toBeInTheDocument()
    })
  })

  it("triggers preview API call when form fields change after file upload", async () => {
    render(<UploadForm />)

    // First upload a file to enable preview functionality
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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

    // Upload the file via dropzone
    dropFiles([createMockExcelFile("test.xlsx", "dummy content")])

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

    // Upload first file (error case)
    dropFiles([createMockExcelFile("test1.xlsx", "dummy content")])

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Virhe/i)).toBeInTheDocument()
    })

    // Upload second file (success case) - this replaces all files
    dropFiles([createMockExcelFile("test2.xlsx", "dummy content")])

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/tiedosto.*luettu onnistuneesti!/i)).toBeInTheDocument()
    })

    // Verify error message is gone
    expect(screen.queryByText(/Virhe/i)).not.toBeInTheDocument()
  })

  it("does not trigger preview when changing fields without file", () => {
    render(<UploadForm />)

    // Fields are disabled when no file is selected
    const comboboxes = screen.getAllByRole("combobox")
    // Try to interact with a combobox - it should be disabled
    expect(comboboxes[1]).toBeDisabled() // Year dropdown

    // Should not call fetch since no file is selected
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("handles download functionality", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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
    dropFiles([createMockExcelFile()])

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it("handles network error during download", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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

  it("shows loading state during download", async () => {
    render(<UploadForm />)

    // Upload file and wait for preview
    await dropFilesAndWaitForPreview([createMockExcelFile()])

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

  describe("Multiple files support", () => {
    it("shows file count in success message for multiple files", async () => {
      render(<UploadForm />)

      // Upload multiple files
      const files = [createMockExcelFile("file1.xlsx"), createMockExcelFile("file2.xlsx")]
      await dropFilesAndWaitForPreview(files)

      // Check success message shows correct count
      expect(screen.getByText(/2 tiedostoa luettu onnistuneesti!/)).toBeInTheDocument()
    })

    it("shows file count in success message for single file", async () => {
      render(<UploadForm />)

      // Upload single file
      await dropFilesAndWaitForPreview([createMockExcelFile()])

      // Check success message for single file
      expect(screen.getByText(/1 tiedosto luettu onnistuneesti!/)).toBeInTheDocument()
    })

    it("displays all uploaded files in the list", async () => {
      render(<UploadForm />)

      const files = [createMockExcelFile("file1.xlsx"), createMockExcelFile("file2.xlsx")]
      await dropFilesAndWaitForPreview(files)

      // Both files should be visible
      expect(screen.getByText("file1.xlsx")).toBeInTheDocument()
      expect(screen.getByText("file2.xlsx")).toBeInTheDocument()
    })
  })

  describe("Demo mode", () => {
    const DEMO_INFO_TEXT = /Demotila aktivoitu/i

    const mockDemoFileResponse = {
      ok: true,
      blob: () =>
        Promise.resolve(
          new Blob(["demo content"], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        ),
    }

    it("renders demo switch with label", () => {
      render(<UploadForm />)

      expect(screen.getByText("Demotila")).toBeInTheDocument()
      expect(screen.getByRole("switch", { name: "Demotila" })).toBeInTheDocument()
    })

    it("loads demo file when switch is enabled", async () => {
      // First call: fetch demo file, second call: preview API
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockDemoFileResponse)
        .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for demo info alert to appear
      await waitFor(() => {
        expect(screen.getByText(DEMO_INFO_TEXT)).toBeInTheDocument()
      })

      // Verify demo file was fetched
      expect(global.fetch).toHaveBeenCalledWith("/elsa-demo.xlsx")
    })

    it("shows preview after demo file is loaded", async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockDemoFileResponse)
        .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for download button (indicates preview loaded)
      await waitFor(() => {
        expect(screen.getByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).toBeInTheDocument()
      })
    })

    it("shows demo-specific success message when demo file is loaded", async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockDemoFileResponse)
        .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for demo-specific success message
      await waitFor(() => {
        expect(screen.getByText(/Demo-Excelin lataus onnistui!/)).toBeInTheDocument()
      })
    })

    it("clears demo state when switch is disabled", async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockDemoFileResponse)
        .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for demo to load
      await waitFor(() => {
        expect(screen.getByText(DEMO_INFO_TEXT)).toBeInTheDocument()
      })

      // Disable demo mode
      fireEvent.click(demoSwitch)

      // Demo info should be hidden
      await waitFor(() => {
        expect(screen.queryByText(DEMO_INFO_TEXT)).not.toBeInTheDocument()
      })

      // Preview should be cleared
      expect(screen.queryByRole("button", { name: DOWNLOAD_BUTTON_TEXT })).not.toBeInTheDocument()
    })

    it("shows error when demo file fetch fails", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/Demo-tiedoston lataus epäonnistui/)).toBeInTheDocument()
      })
    })

    it("disables dropzone when in demo mode", async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockDemoFileResponse)
        .mockResolvedValueOnce(mockSuccessfulPreviewResponse)

      render(<UploadForm />)

      // Enable demo mode
      const demoSwitch = screen.getByRole("switch")
      fireEvent.click(demoSwitch)

      // Wait for demo to load
      await waitFor(() => {
        expect(screen.getByText(DEMO_INFO_TEXT)).toBeInTheDocument()
      })

      // Dropzone should be disabled (has disabled styling)
      const dropzone = screen.getByTestId("dropzone")
      expect(dropzone).toHaveStyle({ opacity: "0.5" })
    })
  })
})
