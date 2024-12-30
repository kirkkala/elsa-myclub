import { useState, FormEvent } from 'react'
import styles from '../styles/Home.module.scss'
import { LuCalendar, LuClock, LuCopyright, LuInfo, LuUpload, LuWandSparkles, LuX } from "react-icons/lu";
import { RiFileExcel2Line } from "react-icons/ri";

const APP_VERSION = '0.1.0-beta' // Single source of truth for version

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

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<string>('')

  const currentYear = new Date().getFullYear()

  const githubTextAndLink = (
    <>Sovelluksen lähdekoodi löytyy <a className={styles.link} href="https://github.com/kirkkala/elsa-myclub" target="_blank" rel="noopener noreferrer" title="github.com/kirkkala/elsa-myclub">GitHubissa</a>.</>
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
        throw new Error(errorData.message || 'Failed to convert file')
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

  const years = Array.from(
    { length: 2030 - currentYear + 1 },
    (_, i) => currentYear + i
  )

  return (
    <div className={styles.container}>
      <h1>ELSA {'->'} MyClub Excel muunnin <span className={styles.version}>v{APP_VERSION}</span></h1>
      <p>Muunna <a className={styles.link}
      href="https://elsa.basket.fi/"
      target="_blank"
      rel="noopener noreferrer">ELSA</a>:sta
      ladattu excel tiedosto <a className={styles.link}
      href="https://hnmky.myclub.fi/"
      target="_blank"
      rel="noopener noreferrer">MyClub</a>:iin soveltuvaksi tuontitiedostoksi.</p>

      <details className={styles.info}>
        <summary>
          <span className={styles.summaryClosed}><LuInfo className={styles.icon} /> Tietoja sovelluksesta</span>
          <span className={styles.summaryOpen}><LuX /></span>
        </summary>
        <div className={styles.infoContent}>
          <h2>Tietoja sovelluksesta</h2>
          <p>
            Tämä on Namikan jojoilijan Timo Kirkkalan (<a className={styles.link} href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>) tekemä
            avoimen lähdekoodin sovellus jonka tavoite on vähentää manuaalisen työn määrää kun halutaan siirtää ELSA:sta pelejä MyClubiin.
          </p>
          <p>Sovellus on vielä ihan vaiheessa ja varmasti buginen eikä sitä ole juurikaan testattu. Mikäli ELSA:an ei tule kunnollista
            export-ominaisuutta syksylle 2025, kehitetään tästä toimiva häkkyrä.</p>
          <p>
            Jotta sovelluksesta saadaan käyttökelpoinen, tarvitsee lisätä ainakin seuraavanlaisia valintoja:
          </p>
          <ul>
            <li>MyClub ryhmän nimi (valinta tai vapaateksti?)</li>
            <li>MyClub ilmoittautumisasetukset (pudotusvalikko)</li>
            <li>MyClub näkyvyysasetukset (pudotusvalikko)</li>
            <li>Ties mitä muuta? Laita toiveet kehittäjälle.</li>
          </ul>
          <hr className={styles.divider} />
          <h3>Muutosloki</h3>
          <div className={styles.changelog}>
            <h4>v0.1.0-beta (2024-12-30)</h4>
            <ul>
              <li>Ensimmäinen beta-versio</li>
              <li>Perustoiminnallisuus ELSA excel tiedostojen muuntamiseen</li>
              <li>Automaattinen divisioonanimen lisäys tapahtuman nimeen</li>
              <li>Tuki pelin keston määrittämiselle</li>
              <li>Tuki eri päivämääräformaateille</li>
            </ul>
          </div>
          <hr className={styles.divider} />
          <h3>Lähdekoodi</h3>
          <p>
            {githubTextAndLink}
          </p>
        </div>
      </details>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="year">
              <LuCalendar /> Vuosi
            </label>
            <p className={styles.fieldDescription}>
              ELSA:n tiedostossa ei ole vuotta, joten sinun tulee asettaa se erikseen.
            </p>
            <select id="year" name="year" required>
              <option value="">Valitse vuosi</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">
              <LuClock className={styles.icon} /> Pelin kesto
            </label>
            <p className={styles.fieldDescription}>
              Valitse pelin kesto, tämän arvon perusteella lasketaan pelin päättymisaika.
            </p>
            <select
              id="duration"
              name="duration"
              required
              defaultValue="75"
            >
              <option value="">Valitse kesto</option>
              <option value="60">1 tunti</option>
              <option value="75">1 tunti 15 minuuttia</option>
              <option value="90">1 tunti 30 minuuttia</option>
              <option value="105">1 tunti 45 minuuttia</option>
              <option value="120">2 tuntia</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>
              <LuUpload /> Valitse tiedosto
            </label>
            <p className={styles.fieldDescription}>
              Valitse ELSA:sta ladattu excel-tiedosto.
            </p>
            <label htmlFor="file" className={styles.fileInputLabel}>
              <RiFileExcel2Line />
              <span>{selectedFile || 'Valitse tiedosto...'}</span>
              {selectedFile && <span className={styles.fileCheck}>✓</span>}
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept=".xlsx,.xls"
              required
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.formGroup}>
          <label htmlFor="file">
            <LuWandSparkles /> Muunna tiedosto
          </label>

          <p className={styles.fieldDescription}>
              Paina taikanappia ja applikaatio muotoilee ELSA:sta tuomasi excel-tiedoston MyClub-yhteensopivaksi
              tuontitiedostoksi yllä annettujen asetusten mukaisesti <LuWandSparkles />.
          </p>

          <button
            type="submit"
            name="submit"
            className={`${styles.button} ${styles.convert}`}
            disabled={loading}
          >
              <LuWandSparkles /> <span className={styles.visuallyHidden}>Taikanappi</span>
            </button>
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

      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <p><LuCopyright style={{ transform: 'translateY(0.15rem)' }} /> Timo Kirkkala {currentYear}</p>
          <p>{githubTextAndLink}</p>
        </div>
      </footer>
    </div>
  )
}
