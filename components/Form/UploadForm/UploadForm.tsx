"use client"

import { useState } from "react"
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

interface FormValues {
  file: File | null
  year: string
  duration: string
  meetingTime: string
  group: string
  eventType: string
  registration: string
}

export default function UploadForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [previewData, setPreviewData] = useState<MyClubExcelRow[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

  const [formValues, setFormValues] = useState<FormValues>({
    file: null,
    year: String(currentYear),
    duration: "90",
    meetingTime: "0",
    group: "",
    eventType: "Ottelu",
    registration: "Valituille henkilöille",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null
    setFormValues((prev) => ({ ...prev, file }))
    setShowSuccess(false)
    setPreviewData([])

    if (file) {
      void fetchPreview(file, formValues)
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))

    if (formValues.file) {
      void fetchPreview(formValues.file, { ...formValues, [name]: value })
    }
  }

  const buildFormData = (file: File, values: FormValues): FormData => {
    const formData = new FormData()
    formData.append("file", file)

    if (values.year) {
      formData.append("year", values.year)
    }
    if (values.duration) {
      formData.append("duration", values.duration)
    }
    if (values.meetingTime) {
      formData.append("meetingTime", values.meetingTime)
    }
    if (values.group) {
      formData.append("group", values.group)
    }
    if (values.eventType) {
      formData.append("eventType", values.eventType)
    }
    if (values.registration) {
      formData.append("registration", values.registration)
    }

    return formData
  }

  const fetchPreview = async (file: File, values: FormValues): Promise<void> => {
    setError("")

    try {
      const formData = buildFormData(file, values)

      const response = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      })

      const data = (await response.json()) as { data: MyClubExcelRow[]; message?: string }

      if (!response.ok) {
        setShowSuccess(false)
        throw new Error(data.message || "Excelin lukeminen epäonnistui")
      }

      setPreviewData(data.data)
      setShowSuccess(true)
    } catch (err) {
      setShowSuccess(false)
      setError(err instanceof Error ? err.message : "Excelin lukeminen epäonnistui")
    }
  }

  const handleDownload = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formValues.file) {
        throw new Error(API_FILE_MISSING)
      }

      const formData = buildFormData(formValues.file, formValues)

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
      <form>
        <FileUpload
          selectedFile={formValues.file?.name || ""}
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

        <div className={!formValues.file || error ? styles.disabledFields : undefined}>
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
            disabled={!formValues.file || !!error}
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
            defaultValue={formValues.year}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
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
            defaultValue={formValues.meetingTime}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
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
            defaultValue={formValues.duration}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
          />

          <SelectField
            id="eventType"
            label="5. Tapahtumatyyppi"
            Icon={CiBasketball}
            options={[{ value: "Ottelu" }, { value: "Muu" }]}
            defaultValue={formValues.eventType}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
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
            defaultValue={formValues.registration}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
          />
        </div>
      </form>

      {previewData.length > 0 && (
        <>
          <form onSubmit={handleDownload} className={styles.downloadForm}>
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
