"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import FileUpload from "../FileUpload/FileUpload"
import SelectField from "../SelectField/SelectField"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PeopleIcon from "@mui/icons-material/People"
import DownloadIcon from "@mui/icons-material/Download"
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball"
import Button from "../Button/Button"
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
    <Box sx={{ my: 3 }}>
      <form>
        <FileUpload
          selectedFile={formValues.file?.name || ""}
          onChange={handleFileChange}
          label="eLSA excel tiedosto"
          description="Valitse eLSA:sta hakemasi Excel tiedosto, jonka pelit haluat siirtää MyClub:iin."
        />

        <Box sx={{ minHeight: 120, mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>🥴 Virhe</AlertTitle>
              {error}
            </Alert>
          )}

          {showSuccess && !error && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Excelin luku onnistui! 🎉</AlertTitle>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                <li>Säädä asetuksia ja esikatsele muunnosta sivun lopussa.</li>
                <li>
                  Lataa muunnettu tiedosto &quot;Lataa Excel&quot; -painikkeella omalle
                  tietokoneellesi.
                </li>
                <li>Mene MyClubiin ja tuo tapahtumat tiedostosta.</li>
              </Box>
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            opacity: !formValues.file || error ? 0.4 : 1,
            pointerEvents: !formValues.file || error ? "none" : "auto",
          }}
        >
          <SelectField
            id="group"
            Icon={PeopleIcon}
            label="1. Joukkue (MyClub ryhmä)"
            description="Valitse joukkueesi listalta tai kirjoita nimi kuten se on MyClubissa."
            options={groupsData.groups.map((option) => ({
              value: option,
              label: option,
            }))}
            placeholder="Hae tai kirjoita joukkueen nimi"
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
            freeSolo
          />

          <SelectField
            id="year"
            label="2. Vuosi"
            description="Valitse vuosi, eLSA:n tiedostossa ei ole vuotta päivämäärien yhteydessä."
            Icon={CalendarMonthIcon}
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
            Icon={AccessTimeIcon}
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
            Icon={AccessTimeIcon}
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
            Icon={SportsBasketballIcon}
            options={[{ value: "Ottelu" }, { value: "Muu" }]}
            defaultValue={formValues.eventType}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
          />

          <SelectField
            id="registration"
            label="6. Ilmoittautuminen"
            description="Valitse kenelle tapahtumaan ilmoittautuminen sallitaan MyClubissa."
            Icon={PeopleIcon}
            options={[
              { value: "Valituille henkilöille" },
              { value: "Ryhmän jäsenille" },
              { value: "Seuralle" },
            ]}
            defaultValue={formValues.registration}
            onChange={handleFieldChange}
            disabled={!formValues.file || !!error}
          />
        </Box>
      </form>

      {previewData.length > 0 && (
        <>
          <Box sx={{ mt: 5 }}>
            <Preview data={previewData} />
          </Box>

          <Box component="form" onSubmit={handleDownload} sx={{ mt: 3 }}>
            <Button
              type="submit"
              disabled={loading}
              Icon={DownloadIcon}
              label="Lataa Excel"
              description={`Tallenna esikatselun mukainen Excel-tiedosto omalle
                tietokoneellesi, muokkaa tarvittaessa ja siirry MyClubiin tuomaan tapahtumat tiedostosta.`}
            >
              {loading ? "Käsitellään..." : "Lataa Excel"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
