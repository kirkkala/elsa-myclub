import { useState, useRef } from "react"
import styles from "./UploadForm.module.scss"
import FileUpload from "../FileUpload/FileUpload"
import SelectField from "../SelectField/SelectField"
import { LuCalendar, LuClock, LuUsers, LuDownload } from "react-icons/lu"
import { CiBasketball } from "react-icons/ci"
import Button from "../Button/Button"
import SelectOrInput from "../SelectOrInput/SelectOrInput"
import groupsData from "../../../config/groups.json"
import Preview from "../../Preview/Preview"
import type { MyClubExcelRow } from "@/utils/excel"
import { API_CONVERSION_FAILED, API_FILE_MISSING } from "@/utils/error"

interface ApiErrorResponse {
  message: string
}

export default function UploadForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [previewData, setPreviewData] = useState<MyClubExcelRow[]>([])
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    setSelectedFile(file ? file.name : "")
    setShowSuccess(false)
    setPreviewData([])
    
    // TODO: Remove this console.log before production
    console.error("File selected:", file?.name)

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

  const handlePreview = async (
    e: React.FormEvent<HTMLFormElement> | React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    // Only call preventDefault if it's a form event
    if ("preventDefault" in e) {
      e.preventDefault()
    }
    setError("")

    const fileInput = document.querySelector<HTMLInputElement>("input[type='file']")
    if (!fileInput) {
      setError("Lomaketta ei löydy")
      setShowSuccess(false)
      return
    }

    const file = fileInput.files?.[0]
    if (!file) {
      setError("Valitse ensin excel-tiedosto")
      setShowSuccess(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Get form values from the form element
      const form = fileInput.form
      if (!form) {
        throw new Error("Form not found")
      }

      const year = (form.querySelector("[name='year']") as HTMLSelectElement).value
      const duration = (form.querySelector("[name='duration']") as HTMLSelectElement).value
      const meetingTime = (form.querySelector("[name='meetingTime']") as HTMLSelectElement).value
      const group = (form.querySelector("[name='group']") as HTMLSelectElement).value
      const eventType = (form.querySelector("[name='eventType']") as HTMLSelectElement).value
      const registration = (form.querySelector("[name='registration']") as HTMLSelectElement).value

      // Only append values if they exist
      if (year) {
        formData.append("year", year)
      }
      if (duration) {
        formData.append("duration", duration)
      }
      if (meetingTime) {
        formData.append("meetingTime", meetingTime)
      }
      if (group) {
        formData.append("group", group)
      }
      if (eventType) {
        formData.append("eventType", eventType)
      }
      if (registration) {
        formData.append("registration", registration)
      }

      const response = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      })
      
      // Debug response status
      console.error("API response status:", response.status)

      const data = (await response.json()) as { data: MyClubExcelRow[]; message?: string }

      if (!response.ok) {
        setShowSuccess(false)
        throw new Error(data.message || "Excelin lukeminen epäonnistui")
      }

      setPreviewData(data.data)
      setShowSuccess(true)
    } catch (err) {
      setShowSuccess(false)
      console.error("Preview error:", err) // This should be proper error logging
      setError(err instanceof Error ? err.message : "Excelin lukeminen epäonnistui")
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
      const fileInput = document.querySelector<HTMLInputElement>("input[type='file']")
      if (!fileInput?.files?.[0]) {
        throw new Error(API_FILE_MISSING)
      }

      const formData = new FormData()
      formData.append("file", fileInput.files[0])

      const mainForm = formRef.current
      if (!mainForm) {
        throw new Error("Form not found")
      }

      const year = (mainForm.querySelector("[name='year']") as HTMLSelectElement).value
      const duration = (mainForm.querySelector("[name='duration']") as HTMLSelectElement).value
      const meetingTime = (mainForm.querySelector("[name='meetingTime']") as HTMLSelectElement)
        .value
      const group = (mainForm.querySelector("[name='group']") as HTMLSelectElement).value
      const eventType = (mainForm.querySelector("[name='eventType']") as HTMLSelectElement).value
      const registration = (mainForm.querySelector("[name='registration']") as HTMLSelectElement)
        .value

      if (year) {
        formData.append("year", year)
      }
      if (duration) {
        formData.append("duration", duration)
      }
      if (meetingTime) {
        formData.append("meetingTime", meetingTime)
      }
      if (group) {
        formData.append("group", group)
      }
      if (eventType) {
        formData.append("eventType", eventType)
      }
      if (registration) {
        formData.append("registration", registration)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = (await response.json()) as ApiErrorResponse
        throw new Error(errorData.message || API_CONVERSION_FAILED)
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
          description="Valitse tähän eLSA:sta haettu Excel jonka pelit haluat siirtää MyClub:iin."
        />

        <div className={styles.messageContainer}>
          {error && (
            <div className={styles.errorMessage}>
              <p>
                <strong>🥴 Virhe:</strong> {error}
              </p>
            </div>
          )}

          {showSuccess && !error && (
            <div className={styles.successMessage}>
              <p>
                <strong>Excelin luku onnistui!</strong> 🎉
              </p>
              <ol>
                <li>Säädä asetuksia ja esikatsele muunnosta sivun lopussa.</li>
                <li>
                  Lataa muunnettu tiedosto "Lataa Excel" -painikkeella omalle tietokoneellesi.
                </li>
                <li>Mene MyClubiin ja tuo tapahtumat tiedostosta.</li>
              </ol>
            </div>
          )}
        </div>

        <div className={!selectedFile || error ? styles.disabledFields : undefined}>
          <SelectOrInput
            id="group"
            Icon={LuUsers}
            label="1. Joukkue (MyClub ryhmä)"
            description={`Valitse joukkueesi listalta tai paina "Kirjoita nimi" ja anna kuten se on MyClubissa.`}
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
            disabled={!selectedFile || !!error}
          />

          <SelectField
            id="year"
            label="2. Vuosi"
            description="Valitse vuosi, eLSA:n tiedostossa ei ole vuotta päivämäärien yhteydessä."
            Icon={LuCalendar}
            options={years.map((year) => ({
              value: String(year),
              label: String(year),
            }))}
            defaultValue={String(currentYear)}
            onChange={handleFieldChange}
            disabled={!selectedFile || !!error}
          />

          <SelectField
            id="meetingTime"
            label="3. Kokoontumisaika"
            description="Voit valita kokoontumisajan lämppää varten, valinta aikaistaa tapahtuman alkamisaikaa."
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
            disabled={!selectedFile || !!error}
          />

          <SelectField
            id="duration"
            label="4. Tapahtuman kesto"
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
            disabled={!selectedFile || !!error}
          />

          <SelectField
            id="eventType"
            label="5. Tapahtumatyyppi"
            Icon={CiBasketball}
            options={[{ value: "Ottelu" }, { value: "Muu" }]}
            defaultValue="Ottelu"
            onChange={handleFieldChange}
            disabled={!selectedFile || !!error}
          />

          <SelectField
            id="registration"
            label="6. Ilmoittautuminen"
            description="Valitse kenelle tapahtumaan ilmoittautuminen sallitaan MyClubissa."
            Icon={LuUsers}
            options={[
              { value: "Valituille henkilöille" },
              { value: "Ryhmän jäsenille" },
              { value: "Seuralle" },
            ]}
            defaultValue="Valituille henkilöille"
            onChange={handleFieldChange}
            disabled={!selectedFile || !!error}
          />
        </div>
      </form>

      {previewData.length > 0 && (
        <>
          <form onSubmit={handleDownloadSubmit} className={styles.downloadForm}>
            <Button
              type="submit"
              disabled={loading}
              Icon={LuDownload}
              label="Lataa Excel"
              description={`Tallenna esikatselun mukainen Excel-tiedosto omalle
                tietokoneellesi, muokkaa tarvittaessa ja siirry MyClubiin tuomaan tapahtumat tiedostosta.`}
            >
              {loading ? "Käsitellään..." : "Lataa Excel"}
            </Button>
          </form>

          <Preview data={previewData} />
        </>
      )}
    </div>
  )
}
