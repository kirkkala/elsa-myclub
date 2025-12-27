import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import FileUpload from "../FileUpload"

const createMockFile = (name: string, size = 1024) =>
  new File(["x".repeat(size)], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

const mockProps = {
  label: "eLSA excel tiedosto",
  description: "Valitse Excel tiedosto",
  files: [] as File[],
  onFilesChange: jest.fn(),
}

describe("FileUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders label and description", () => {
    render(<FileUpload {...mockProps} />)
    expect(screen.getByText("eLSA excel tiedosto")).toBeInTheDocument()
    expect(screen.getByText("Valitse Excel tiedosto")).toBeInTheDocument()
  })

  it("shows dropzone instructions when no files", () => {
    render(<FileUpload {...mockProps} />)
    expect(
      screen.getByText("Pudota eLSA:sta haetut excel-tiedostot tai klikkaa valitaksesi")
    ).toBeInTheDocument()
    expect(screen.getByText("Tuetut tiedostomuodot: .xlsx")).toBeInTheDocument()
  })

  it("displays uploaded files as chips", () => {
    const files = [createMockFile("test1.xlsx"), createMockFile("test2.xlsx")]
    render(<FileUpload {...mockProps} files={files} />)

    expect(screen.getByText("test1.xlsx")).toBeInTheDocument()
    expect(screen.getByText("test2.xlsx")).toBeInTheDocument()
    expect(screen.getByText("2 tiedostoa lisätty")).toBeInTheDocument()
  })

  it("calls onFilesChange when files are selected via input", async () => {
    const onFilesChange = jest.fn()
    render(<FileUpload {...mockProps} onFilesChange={onFilesChange} />)

    const input = screen.getByTestId("file-input")
    const file = createMockFile("test.xlsx")

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalled()
    })
  })

  it("allows removing individual files", () => {
    const onFilesChange = jest.fn()
    const files = [createMockFile("test1.xlsx"), createMockFile("test2.xlsx")]
    render(<FileUpload {...mockProps} files={files} onFilesChange={onFilesChange} />)

    // MUI Chip renders the delete icon as an SVG inside the chip
    const chip = screen.getByText("test1.xlsx").closest(".MuiChip-root")
    const deleteIcon = chip?.querySelector(".MuiChip-deleteIcon")
    expect(deleteIcon).toBeInTheDocument()
    fireEvent.click(deleteIcon!)

    expect(onFilesChange).toHaveBeenCalledWith([files[1]])
  })

  it("has proper accessibility attributes", () => {
    render(<FileUpload {...mockProps} />)
    const input = screen.getByTestId("file-input")
    expect(input).toHaveAttribute("aria-label", mockProps.label)
  })

  it("disables interaction when disabled prop is true", () => {
    render(<FileUpload {...mockProps} disabled={true} />)
    const dropzone = screen.getByTestId("dropzone")
    expect(dropzone).toHaveStyle({ cursor: "not-allowed" })
  })

  it("prevents duplicate files by name when adding new files", async () => {
    const onFilesChange = jest.fn()
    const existingFile = createMockFile("test.xlsx")
    render(<FileUpload {...mockProps} files={[existingFile]} onFilesChange={onFilesChange} />)

    const input = screen.getByTestId("file-input")
    const duplicateFile = createMockFile("test.xlsx")
    const newFile = createMockFile("new.xlsx")

    fireEvent.change(input, { target: { files: [duplicateFile, newFile] } })

    await waitFor(() => {
      expect(onFilesChange).toHaveBeenCalledWith([existingFile, newFile])
    })
  })

  it("shows singular text for single file", () => {
    const file = createMockFile("test.xlsx")
    render(<FileUpload {...mockProps} files={[file]} />)

    expect(screen.getByText("1 tiedosto lisätty")).toBeInTheDocument()
  })
})
