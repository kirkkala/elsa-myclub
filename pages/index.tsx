import React from "react"
import Link from "next/link"
import { LuBookMarked, LuGithub } from "react-icons/lu"
import { SITE_CONFIG } from "../config"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import Info from "../components/Info/Info"
import UploadForm from "../components/Form/UploadForm/UploadForm"
import Footer from "../components/Footer/Footer"

export default function Home(): React.ReactElement {
  return (
    <Layout>
      <Header />
      <p>
        Helpota jojotöitä ja muunna{" "}
        <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
          eLSA
        </a>
        :sta ladattu excel{" "}
        <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
          MyClub
        </a>
        :iin soveltuvaksi tuontitiedostoksi.
      </p>
      <Info title="Tietoja sovelluksesta" expandable>
        <p>
          Tämä on HNMKY Stadi 2014 tyttöjen jojon Timo Kirkkalan tekemä sovellus
          jolla vähennetään manuaalisen työn määrää kun halutaan siirtää{" "}
          <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
            eLSA
          </a>
          :sta pelejä{" "}
          <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
            MyClub
          </a>
          :iin. Sovelluksen koodi on julkaistu avoimena lähdekoodina{" "}
          <a href={SITE_CONFIG.links.githubAppRepoUrl} target="_blank" rel="noopener noreferrer">
            GitHubissa
          </a>
          .
        </p>
        <h3>Kenelle sovellus on tarkoitettu?</h3>
        <p>
          <a href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
            HNMKY
          </a>
          :n joukkueet voivat valita ryhmän nimen valintalistalta mutta hyvän
          pelihengen nimissä myös muut kuin Namikan joukkueet on otettu huomioon
          sovellusta kehittäessä, MyClub ryhmän nimen voi siis antaa myös käsin
          kirjoitettuna.
        </p>
        <p>
          Toivottavasti sovelluksesta on apua, tsemppiä peleihin sekä koko tämän
          ruljanssin pyörittämiseen, HOS! 💪🏀
        </p>
        <h3>Betaversio</h3>
        <p>
          Sovellus on betaversiossa eikä välttämättä ihan täydellinen.
          Tavoitteena on tehdä tästä &ldquo;bulletproof&rdquo; syksylle 2025 kun
          jojot seuraavan kerran päääsevät siirtämään otteluita ELSA:sta
          MyClub:iin.
        </p>
        <h3>Selainvaatimukset</h3>
        <p style={{ marginBottom: "0.25rem" }}>Sovellus toimii parhaiten
          uusimmilla selaimilla:</p>
        <ul className="compact-list">
          <li>Google Chrome</li>
          <li>Microsoft Edge</li>
          <li>Mozilla Firefox</li>
          <li>Safari</li>
        </ul>
        <p>
          Huom! Sovellus tuskin toimii Internet Explorer -selaimella.
        </p>
        <h3>Tietosuojaseloste</h3>
        <p>
          Sovellus ei kerää tietoa käyttäjästä, ainoastaan vähän statistiikkaa
          kävijämääristä. Sovellukseen ladattuja excel-tiedostoja ei tallenneta
          mihinkään muualle kuin käyttäjän omalle tietokoneelle. Keksejä eli
          niitä herkullisia evästeitäkään ei täällä käytetä 🍪
        </p>
        <hr />
        <ul className="list-reset">
          <li>
            <LuBookMarked /> Sovelluksen <Link href="/changelog">versiohistoria</Link>
          </li>
          <li>
            <LuGithub /> Lähdekoodi{" "}
            <a href={SITE_CONFIG.links.githubAppRepoUrl} target="_blank" rel="noopener noreferrer">
              GitHubissa
            </a>
          </li>
        </ul>
      </Info>
      <h2 className="visually-hidden">Konversiolomake</h2>
      <UploadForm />
      <Footer />
    </Layout>
  )
}
