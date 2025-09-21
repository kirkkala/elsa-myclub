import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Preview from "../Preview"
import type { MyClubExcelRow } from "@/utils/excel"

const mockData: MyClubExcelRow[] = [
  {
    Nimi: "I div. Team A - Team B",
    Ryhmä: "Test Group",
    Tapahtumatyyppi: "Ottelu",
    Tapahtumapaikka: "Namika Areena LIIKE ON LÄÄKE B",
    Alkaa: "2024-01-01 10:00:00",
    Päättyy: "2024-01-01 11:00:00",
    Ilmoittautuminen: "Valituille henkilöille",
    Näkyvyys: "Näkyy ryhmälle",
    Kuvaus: "Test Description",
  },
  {
    Nimi: "II div. Team C - Team D",
    Ryhmä: "Test Group 2",
    Tapahtumatyyppi: "Muu",
    Tapahtumapaikka: "Another Venue",
    Alkaa: "2024-01-02 14:30:00",
    Päättyy: "2024-01-02 16:00:00",
    Ilmoittautuminen: "Ryhmän jäsenille",
    Näkyvyys: "Näkyy ryhmälle",
    Kuvaus: "Another Description",
  },
]

describe("Preview component", () => {
  it("renders nothing when data is empty", () => {
    const { container } = render(<Preview data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders table with correct headers", () => {
    render(<Preview data={mockData} />)

    expect(screen.getByText("#")).toBeInTheDocument()
    expect(screen.getByText("Nimi")).toBeInTheDocument()
    expect(screen.getByText("Alkaa")).toBeInTheDocument()
    expect(screen.getByText("Päättyy")).toBeInTheDocument()
    expect(screen.getByText("Kuvaus")).toBeInTheDocument()
    expect(screen.getByText("Ryhmä")).toBeInTheDocument()
    expect(screen.getByText("Tapahtumatyyppi")).toBeInTheDocument()
    expect(screen.getByText("Tapahtumapaikka")).toBeInTheDocument()
    expect(screen.getByText("Ilmoittautuminen")).toBeInTheDocument()
    expect(screen.getByText("Näkyvyys")).toBeInTheDocument()
  })

  it("renders all data rows with correct content", () => {
    render(<Preview data={mockData} />)

    // Check first row
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("I div. Team A - Team B")).toBeInTheDocument()
    expect(screen.getByText("2024-01-01 10:00:00")).toBeInTheDocument()
    expect(screen.getByText("2024-01-01 11:00:00")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
    expect(screen.getByText("Test Group")).toBeInTheDocument()
    expect(screen.getByText("Ottelu")).toBeInTheDocument()
    expect(screen.getByText("Namika Areena LIIKE ON LÄÄKE B")).toBeInTheDocument()
    expect(screen.getByText("Valituille henkilöille")).toBeInTheDocument()

    // Check second row
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("II div. Team C - Team D")).toBeInTheDocument()
    expect(screen.getByText("2024-01-02 14:30:00")).toBeInTheDocument()
    expect(screen.getByText("2024-01-02 16:00:00")).toBeInTheDocument()
    expect(screen.getByText("Another Description")).toBeInTheDocument()
    expect(screen.getByText("Test Group 2")).toBeInTheDocument()
    expect(screen.getByText("Muu")).toBeInTheDocument()
    expect(screen.getByText("Another Venue")).toBeInTheDocument()
    expect(screen.getByText("Ryhmän jäsenille")).toBeInTheDocument()
  })

  it("generates unique keys for rows", () => {
    render(<Preview data={mockData} />)

    const rows = screen.getAllByRole("row")
    // Should have header row + 2 data rows
    expect(rows).toHaveLength(3)

    // Check that rows are rendered (keys are internal to React)
    expect(screen.getByText("I div. Team A - Team B")).toBeInTheDocument()
    expect(screen.getByText("II div. Team C - Team D")).toBeInTheDocument()
  })
})
