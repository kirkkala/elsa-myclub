import Link from 'next/link'
import styles from './Info.module.scss'
import { LuBookMarked, LuGithub, LuInfo, LuX } from "react-icons/lu"

export default function Info() {
  return (
    <details className={styles.info}>
      <summary>
        <span className={styles.summaryClosed}><LuInfo className={styles.icon} /> Tietoja sovelluksesta</span>
        <span className={styles.summaryOpen}><LuX /></span>
      </summary>
      <div className={styles.infoContent}>
        <h2>Tietoja sovelluksesta</h2>
        <p>
          Tämä on Namikan Stadi 2014 tyttöjen jojon Timo Kirkkalan (<a className={styles.link} href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>) tekemä
          avoimen lähdekoodin sovellus jonka tavoite on vähentää manuaalisen työn määrää kun halutaan siirtää ELSA:sta pelejä MyClubiin.
        </p>
        <p>Sovellus on vielä betaversiossa ja mahdollisesti buginenkin. Tavoitteena on tehdä tästä &ldquo;bulletproof&rdquo;
          syksylle 2025 kun jojot seuraavan kerran päääsevät siirtämään otteluita ELSA:sta MyClub:iin.</p>
        <hr className={styles.divider} />
        <p><LuGithub /> Sovelluksen lähdekoodi: <a
          className={styles.link}
          href="https://github.com/kirkkala/elsa-myclub"
          target="_blank"
          rel="noopener noreferrer"
          title="github.com/kirkkala/elsa-myclub"> GitHub</a></p>
        <p><LuBookMarked /> Sovelluksen versiohistoria: <Link href="/changelog" className={styles.link}>/changelog</Link>.</p>
      </div>
    </details>
  )
}
