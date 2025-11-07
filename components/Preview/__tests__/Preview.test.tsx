import { render, screen } from "@testing-library/react"
import Preview from "../Preview"
import type { MyClubExcelRow } from "@/utils/excel"

const mockData: MyClubExcelRow[] = [
  {
    Nimi: "Team A - Team B",
    Ryhmä: "Group 1",
    Tapahtumatyyppi: "Ottelu",
    Tapahtumapaikka: "Venue 1",
    Alkaa: "2024-01-01 10:00:00",
    Päättyy: "2024-01-01 11:00:00",
    Ilmoittautuminen: "Valituille henkilöille",
    Näkyvyys: "Näkyy ryhmälle",
    Kuvaus: "Description 1",
  },
  {
    Nimi: "Team C - Team D",
    Ryhmä: "Group 2",
    Tapahtumatyyppi: "Muu",
    Tapahtumapaikka: "Venue 2",
    Alkaa: "2024-01-02 14:30:00",
    Päättyy: "2024-01-02 16:00:00",
    Ilmoittautuminen: "Ryhmän jäsenille",
    Näkyvyys: "Näkyy ryhmälle",
    Kuvaus: "Description 2",
  },
]

describe("Preview", () => {
  it("renders nothing when empty", () => {
    const { container } = render(<Preview data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders table with data", () => {
    render(<Preview data={mockData} />)

    // Headers and data
    expect(screen.getByText("#")).toBeInTheDocument()
    expect(screen.getByText("Nimi")).toBeInTheDocument()
    expect(screen.getByText("Team A - Team B")).toBeInTheDocument()
    expect(screen.getByText("2024-01-01 10:00:00")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(3) // header + 2 data rows
  })
})
