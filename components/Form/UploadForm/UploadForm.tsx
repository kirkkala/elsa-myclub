import { useState, useRef } from "react"
import styles from "./UploadForm.module.scss"
import FileUpload from "../FileUpload/FileUpload"
import SelectField from "../SelectField/SelectField"
import { LuCalendar, LuCalendarClock, LuClock, LuUsers, LuDownload } from "react-icons/lu"
import Button from "../Button/Button"
import SelectOrInput from "../SelectOrInput/SelectOrInput"
import groupsData from "../../../config/groups.json"
import Preview from "../../Preview/Preview"
import type { MyClubExcelRow } from "@/utils/excel"

interface ApiErrorResponse {
  message: string
}

interface PreviewApiResponse {
  data: MyClubExcelRow[]
}

type ApiResponse = PreviewApiResponse | ApiErrorResponse

interface FormElements extends HTMLFormElement {
  year: HTMLSelectElement
  duration: HTMLSelectElement
  meetingTime: HTMLSelectElement
  group: HTMLInputElement | HTMLSelectElement
  eventType: HTMLSelectElement
  registration: HTMLSelectElement
}

export default function UploadForm(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [previewData, setPreviewData] = useState<MyClubExcelRow[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    setSelectedFile(file ? file.name : "")

    // Trigger preview if file is selected
    if (file) {
      const form = e.target.form
      if (form) {
        const formEvent = { currentTarget: form } as React.FormEvent<HTMLFormElement>
        void handlePreview(formEvent)
      }
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    if (!selectedFile) {
      return
    }

    const form = e.target.form
    if (form) {
      const formEvent = { currentTarget: form } as React.FormEvent<HTMLFormElement>
      void handlePreview(formEvent)
    }
  }

  const handlePreview = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      })

      const result = (await response.json()) as ApiResponse

      if (!response.ok) {
        throw new Error("message" in result ? result.message : "Tiedoston esikatselu epäonnistui")
      }

      if (!("data" in result)) {
        throw new Error("Virheellinen vastaus palvelimelta")
      }

      setPreviewData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void handleDownload(e)
  }

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const fileInput = document.querySelector("input[type=\"file\"]") as HTMLInputElement
      if (!fileInput.files?.[0]) {
        throw new Error("Tiedosto puuttuu")
      }

      const formData = new FormData()
      formData.append("file", fileInput.files[0])

      const mainForm = formRef.current as FormElements

      formData.append("year", mainForm.year.value)
      formData.append("duration", mainForm.duration.value)
      formData.append("meetingTime", mainForm.meetingTime.value)
      formData.append("group", mainForm.group.value)
      formData.append("eventType", mainForm.eventType.value)
      formData.append("registration", mainForm.registration.value)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse
        throw new Error(errorData.message || "Tiedoston muunnos epäonnistui")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "elsa-myclub-import.xlsx"
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
      <form ref={formRef}>
        <FileUpload
          selectedFile={selectedFile}
          onChange={handleFileChange}
          label="eLSA excel tiedosto"
          description="Valitse eLSA:sta lataamasi excel-tiedosto. Näet
          esikatselun muunnoksesta sivun alalaidassa ja voit muuttaa asetuksia
          saadaksesi haluamasi laisen tiedoston MyClub importia."
        />

        <SelectOrInput
          id="group"
          Icon={LuUsers}
          label="Joukkue (MyClub ryhmä)"
          description={`Joukkueen nimen perusteella MyClub osaa yhdistää
            tuontitiedoston oikeaan ryhmään. Mikäli joukkueesi nimi (MyClub
            ryhmä) ei ole listalla, paina "Kirjoita nimi" ja voit antaa
            joukkueen nimen itse.`}
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
          onChange={handleFieldChange}
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
          onChange={handleFieldChange}
        />

        <SelectField
          id="meetingTime"
          label="Kokoontumisaika"
          description="Valitse kuinka monta minuuttia ennen ottelun alkua joukkueen tulee olla paikalla esim lämppää varten. Valinta aikaistaa tapahtuman alkuaikaa valitun minuuttimäärän verran."
          Icon={LuClock}
          options={[
            { value: "0", label: "Ei aikaistusta" },
            { value: "15", label: "15 min ennen ottelun alkua" },
            { value: "30", label: "30 min ennen ottelun alkua" },
            { value: "45", label: "45 min ennen ottelun alkua" },
            { value: "60", label: "60 min ennen ottelun alkua" },
            { value: "75", label: "1 h 15 min ennen ottelun alkua" },
            { value: "90", label: "1 h 30 min ennen ottelun alkua" },
          ]}
          defaultValue="0"
          onChange={handleFieldChange}
        />

        <SelectField
          id="duration"
          label="Tapahtuman kesto"
          description="Ottelun kesto, tämän perusteella lasketaan tapahtuman päättymisaika eli mahdollinen kokoontumisaika lisättynä."
          Icon={LuClock}
          options={[
            { value: "60", label: "1 tunti" },
            { value: "75", label: "1 tunti 15 minuuttia" },
            { value: "90", label: "1 tunti 30 minuuttia" },
            { value: "105", label: "1 tunti 45 minuuttia" },
            { value: "120", label: "2 tuntia" },
          ]}
          defaultValue="90"
          onChange={handleFieldChange}
        />

        <SelectField
          id="eventType"
          label="Tapahtumatyyppi"
          description="Valitse tapahtuman tyyppi MyClubissa."
          Icon={LuCalendarClock}
          options={[
            { value: "Ottelu" },
            { value: "Muu" },
          ]}
          defaultValue="GAME"
          onChange={handleFieldChange}
        />

        <SelectField
          id="registration"
          label="Ilmoittautuminen"
          description="Valitse kenelle tapahtuma näkyy MyClubissa."
          Icon={LuUsers}
          options={[
            { value: "Valituille henkilöille" },
            { value: "Ryhmän jäsenille" },
            { value: "Seuralle" },
          ]}
          defaultValue="Valituille henkilöille"
          onChange={handleFieldChange}
        />
      </form>

      {previewData.length > 0 && (
        <>
          <form onSubmit={handleDownloadSubmit} className={styles.downloadForm}>
            <Button
              type="submit"
              disabled={loading}
              Icon={LuDownload}
              label="Lataa Excel"
              description={`Tallenna esikatselun mukainen excel-tiedosto omalle
                koneellesi MyClubin importia varten.`}
            >
              {loading ? "Käsitellään..." : "Lataa Excel"}
            </Button>
          </form>

          <Preview data={previewData} />
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
