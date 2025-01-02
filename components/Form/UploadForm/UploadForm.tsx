import { useState, FormEvent } from 'react'
import styles from './UploadForm.module.scss'
import FileInput from '../FileInput/FileInput'
import SelectField from '../SelectField/SelectField'
import {
  LuCalendar,
  LuCalendarClock,
  LuClock,
  LuUsers,
  LuWandSparkles,
} from "react-icons/lu"
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'

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
  const [error, setError] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<string>('')

  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: 2030 - currentYear + 1 },
    (_, i) => currentYear + i
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file ? file.name : '')
  }

  const handleSubmit = async (e: FormEvent<ConversionForm>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse
        throw new Error(errorData.message || 'Tiedoston muunnos epäonnistui')
      }

      const disposition = response.headers.get('Content-Disposition')
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/"/g, '')
        : 'converted.xlsx'

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <FileInput
          selectedFile={selectedFile}
          onChange={handleFileChange}
        />

        <TextInput
          id="group"
          label="Ryhmä"
          description="Kirjoita MyClub ryhmäsi nimi. Löydät oikean ryhmän nimen MyClub:n esimerkkitiedostosta"
          Icon={LuUsers}
          placeholder="esim. HNMKY Stadi 2014 tytöt"
          required
        />

        <SelectField
          id="year"
          label="Vuosi"
          description="Tarvitaan koska ELSA:n exportissa ei ole vuotta päivämäärien yhteydessä."
          Icon={LuCalendar}
          options={years.map(year => ({
            value: String(year),
            label: String(year)
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
            { value: "45", label: "45 minuuttia ennen" }
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
            { value: "120", label: "2 tuntia" }
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
            { value: "OTHER", label: "Muu" }
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
            { value: "CLUB", label: "Seuralle" }
          ]}
          defaultValue="SELECTED"
        />

        <div className={styles.submitGroup}>
          <Button type="submit" disabled={loading} Icon={LuWandSparkles}>
            Muunna tiedosto
          </Button>
        </div>
      </form>

      {loading && (
        <div className={styles.loading}>
          <span className={styles.spinner} />
          Muunnetaan tiedostoa...
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
