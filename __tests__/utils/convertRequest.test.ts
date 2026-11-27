import { convertRequest } from "@/utils/convertRequest"
import { excelUtils, type MyClubExcelRow } from "@/utils/excel"

const row = (name: string): MyClubExcelRow => ({
  Nimi: name,
  Ryhmä: "Test Team",
  Tapahtumatyyppi: "Ottelu",
  Tapahtumapaikka: "Arena",
  Alkaa: "28.11.2026 12:30:00",
  Päättyy: "28.11.2026 14:00:00",
  Ilmoittautuminen: "Valituille henkilöille",
  Näkyvyys: "Ryhmälle",
  Kuvaus: "Peli alkaa: 12:30",
})

const requestWith = (fileNames: string[]) => {
  const formData = new FormData()
  for (const name of fileNames) {
    formData.append("files", new File(["x"], name))
  }
  formData.append("year", "2026")
  return new Request("http://localhost/api/preview", { method: "POST", body: formData })
}

const convert = async (request: Request) => {
  const response = await convertRequest(request, (rows) => Response.json(rows))
  return { status: response.status, body: await response.json() }
}

describe("convertRequest", () => {
  afterEach(() => vi.restoreAllMocks())

  it("passes the form fields to the converter and returns its rows", async () => {
    const parse = vi.spyOn(excelUtils, "parseExcelBuffer").mockReturnValue([row("A - B")])

    const { status, body } = await convert(requestWith(["a.xlsx"]))

    expect(status).toBe(200)
    expect(body).toEqual([row("A - B")])
    expect(parse).toHaveBeenCalledWith(expect.anything(), { year: "2026" })
  })

  it("drops identical games that appear in more than one file", async () => {
    vi.spyOn(excelUtils, "parseExcelBuffer")
      .mockReturnValueOnce([row("A - B"), row("C - D")])
      .mockReturnValueOnce([row("A - B"), row("E - F")])

    const { body } = await convert(requestWith(["a.xlsx", "copy-of-a.xlsx"]))

    expect(body.map((r: MyClubExcelRow) => r.Nimi)).toEqual(["A - B", "C - D", "E - F"])
  })

  it("responds 400 when no files are sent", async () => {
    const { status, body } = await convert(requestWith([]))

    expect(status).toBe(400)
    expect(body.message).toBe("No files provided")
  })

  it("responds 500 and names the file that failed to convert", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.spyOn(excelUtils, "parseExcelBuffer")
      .mockReturnValueOnce([row("A - B")])
      .mockImplementationOnce(() => {
        throw new Error("bad file")
      })

    const { status, body } = await convert(requestWith(["good.xlsx", "broken.xlsx"]))

    expect(status).toBe(500)
    expect(body.message).toContain('Tiedosto "broken.xlsx": bad file')
    expect(body.message).not.toContain("good.xlsx")
    expect(body.fileName).toBe("broken.xlsx")
  })
})
