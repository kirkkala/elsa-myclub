import { useState, FormEvent } from 'react'
import styles from '../styles/Home.module.scss'

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

  const currentYear = new Date().getFullYear()

  const githubTextAndLink = (
    <>Sovelluksen lähdekoodi on saatavilla <a href="https://github.com/kirkkala/elsa-myclub" target="_blank" rel="noopener noreferrer" title="github.com/kirkkala/elsa-myclub">GitHubissa</a>.</>
  )

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
      <h1>ELSA {'->'} MyClub Excel muunnin</h1>
      <p>Muunna ELSA:n excel tiedosto MyClubiin sopivaksi tuontitiedostoksi.</p>

      <details className={styles.credits}>
        <summary>Tietoja sovelluksesta</summary>
        <div className={styles.creditsContent}>
          <p>
            Tämä on Namikan jojoilijan Timo Kirkkalan (<a href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>) tekemä avoimen lähdekoodin sovellus jonka tavoite on vähentää manuaalisen työn määrää kun halutaan siirtää ELSA:sta pelejä MyClubiin.
          </p>
          <p>Sovellus on vielä ihan vaiheessa ja varmasti buginen eikä sitä ole juurikaan testattu. Mikäli ELSA:an ei tule kunnollista export-ominaisuutta syksylle 2025, kehitetään tästä toimiva häkkyrä.</p>
          <p>
            Jotta sovelluksesta saadaan käyttökelpoinen, tarvitsee lisätä ainakin seuraavanlaisia valintoja:
          </p>
          <ul>
            <li>MyClub ryhmän nimi (valinta tai vapaateksti?)</li>
            <li>MyClub ilmoittautumisasetukset (pudotusvalikko)</li>
            <li>MyClub näkyvyysasetukset (pudotusvalikko)</li>
            <li>Ties mitä muuta? Laita toiveet kehittäjälle.</li>
          </ul>
          <p style={{ marginTop: '2rem' }}>
            {githubTextAndLink}
          </p>
        </div>
      </details>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="year">Vuosi</label>
            <p className={styles.fieldDescription}>
              ELSA:n tiedostossa ei ole vuotta, joten se pitää valita erikseen.
            </p>
            <select id="year" name="year" required>
              <option value="">Valitse vuosi</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">Pelin kesto</label>
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
            <p className={styles.fieldDescription}>
              Valitse ELSA:n excel tiedosto jonka haluat muuntaa MyClubiin sopivaksi tuontitiedostoksi.
              <br />
              <strong>Huom!</strong> Elsan pitkä tiedostonimi saattaa aiheuttaa ongelmia,
              anna tiedostolle lyhyempi nimi ja ilman erikoismerkkejä ennen kuin lisäät sen tästä.
            </p>
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              required
            />
          </div>

          <p className={styles.fieldDescription}>
            Paina nappulaa muuntaaksesi tiedoston (avaa tiedoston tallennusikkunan) 🪄
          </p>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            Muunna
          </button>
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
          <p>&copy; Timo Kirkkala {currentYear}</p>
          <p>{githubTextAndLink}</p>
        </div>
      </footer>
    </div>
  )
}
