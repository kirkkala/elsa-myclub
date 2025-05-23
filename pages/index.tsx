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
      <Info title="Tietoja sovelluksesta" expandable>
        <p>
          <strong>{SITE_CONFIG.name}</strong> helpottaa excel-jumppaa pelien
          siirtämisessä{" "}
          <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
            eLSA
          </a>
          :sta{" "}
          <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
            MyClub
          </a>:iin.
        </p>
        <h3>Kenelle sovellus on tarkoitettu?</h3>
        <p>Sovellus on avoin ja vapaasti käytettävissä kenelle tahansa koripalloseuran
          taustahenkilölle ketkä siirtävät pelejä eLSA:sta MyClub:iin.</p>
        <p>
          <a href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
            Helsingin NMKY
          </a>
          :n joukkueiden ryhmät on valittavissa listalta mutta joukkueen nimen
          voi antaa myös käsin niin muidenkin seurojen joukkueet voivat hyödyntää
          sovellusta.
        </p>
        <h3>Löysitkö bugin?</h3>
        <p>
          Löysitkö bugin tai keksit parannusehdotuksen? Tai haluat lähettää muuta
          palautetta?
        </p>
        <p>
          Laita viestiä kehittäjälle: <a href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>.
        </p>
        <p>
          Tai osallistu lähdekoodin kehittämiseen{" "}
          <a
            href="https://github.com/kirkkala/elsa-myclub"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHubissa
          </a>
          . Kyllä, lähdekoodi on avoin ja vapaasti käytettävissä.
        </p>
        <h3>Tietosuojaseloste</h3>
        <p>
          Sovellus ei kerää tietoa käyttäjistä, ainoastaan yksilöimätöntä statistiikkaa
          kävijämääristä. Sovellukseen ladattuja tiedostoja ei tallenneta mihinkään muualle
          kuin käyttäjän omalle tietokoneelle. Keksejä eli evästeitäkään ei täällä käytetä.
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
