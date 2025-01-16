import { useState, FormEvent } from "react"
import styles from "./UploadForm.module.scss"
import FileUpload from "../FileUpload/FileUpload"
import SelectField from "../SelectField/SelectField"
import { LuCalendar, LuCalendarClock, LuClock, LuUsers, LuWandSparkles } from "react-icons/lu"
import Button from "../Button/Button"
import SelectOrInput from "../SelectOrInput/SelectOrInput"
import groupsData from "../../../config/groups.json"

interface ApiErrorResponse {
  message: string
}

interface FormElements extends HTMLFormControlsCollection {
  year: HTMLSelectElement
  duration: HTMLSelectElement
  file: HTMLInputElement
}

interface ConversionForm extends HTMLFormElement {
  readonly elements: FormElements
}

export default function UploadForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<string>("")

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file ? file.name : "")
  }

  const handleSubmit = async (e: FormEvent<ConversionForm>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = (await response.json()) as ApiErrorResponse
        throw new Error(errorData.message || "Tiedoston muunnos epäonnistui")
      }

      const disposition = response.headers.get("Content-Disposition")
      const filename = disposition
        ? disposition.split("filename=")[1].replace(/"/g, "")
        : "converted.xlsx"

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <FileUpload selectedFile={selectedFile} onChange={handleFileChange} />

        <SelectOrInput
          id="group"
          Icon={LuUsers}
          label="Joukkue (MyClub ryhmä)"
          description={`Joukkueen nimen perusteella MyClub osaa yhdistää
            tuontitiedoston oikeaan ryhmään. Mikäli joukkueesi nimi (MyClub ryhmä)
            ei ole listalla, paina "Kirjoita nimi" ja voit antaa joukkueen nimen itse.`}
          switchText={{
            toInput: {
              action: "Kirjoita nimi",
            },
            toList: {
              action: "Näytä listavalitsin (HNMKY)",
            },
          }}
          options={groupsData.groups.map((option) => ({
            value: option,
            label: option,
          }))}
          placeholder="esim. Harlem Globetrotters"
          required
        />

        <SelectField
          id="year"
          label="Vuosi"
          description="eLSA:n exportissa ei ole vuotta päivämäärien yhteydessä, joten tämän pitää antaa manuaalisesti."
          Icon={LuCalendar}
          options={years.map((year) => ({
            value: String(year),
            label: String(year),
          }))}
          defaultValue={String(currentYear)}
        />

        <SelectField
          id="meetingTime"
          label="Kokoontumisaika"
          description="Valitse kuinka monta minuuttia ennen ottelun alkua joukkueen tulee olla paikalla esim lämppää varten. Valinta aikaistaa tapahtuman alkuaikaa valitun minuuttimäärän verran."
          Icon={LuClock}
          options={[
            { value: "0", label: "Ei aikaistusta" },
            { value: "15", label: "15 minuuttia ennen" },
            { value: "30", label: "30 minuuttia ennen" },
            { value: "45", label: "45 minuuttia ennen" },
          ]}
          defaultValue="0"
        />

        <SelectField
          id="duration"
          label="Tapahtuman kesto"
          description="Valinnan perusteella lasketaan tapahtuman päättymisaika."
          Icon={LuClock}
          options={[
            { value: "60", label: "1 tunti" },
            { value: "75", label: "1 tunti 15 minuuttia" },
            { value: "90", label: "1 tunti 30 minuuttia" },
            { value: "105", label: "1 tunti 45 minuuttia" },
            { value: "120", label: "2 tuntia" },
          ]}
          defaultValue="90"
        />

        <SelectField
          id="eventType"
          label="Tapahtumatyyppi"
          description="Valitse tapahtuman tyyppi MyClubissa."
          Icon={LuCalendarClock}
          options={[
            { value: "GAME", label: "Ottelu" },
            { value: "OTHER", label: "Muu" },
          ]}
          defaultValue="GAME"
        />

        <SelectField
          id="participants"
          label="Ilmoittautuminen"
          description="Valitse kenelle tapahtuma näkyy MyClubissa."
          Icon={LuUsers}
          options={[
            { value: "SELECTED", label: "Valituille henkilöille" },
            { value: "GROUP", label: "Ryhmän jäsenille" },
            { value: "CLUB", label: "Seuralle" },
          ]}
          defaultValue="SELECTED"
        />

        <Button
          type="submit"
          disabled={loading || !selectedFile}
          Icon={LuWandSparkles}
          label="Muunna tiedosto"
          description={
            selectedFile
              ? "Paina nappia muutaaksesi eLSA:n excel tiedosto MyClub yhteensopivaksi"
              : "Lisää ensin eLSA excel tiedosto jonka haluat muuntaa"
          }
        >
          {loading ? "Muunnetaan..." : "Muunna tiedosto"}
        </Button>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  )
}
