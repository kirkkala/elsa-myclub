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
        Muunna{" "}
        <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
          eLSA
        </a>
        :sta ladattu excel-tiedosto{" "}
        <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
          MyClub
        </a>
        :iin soveltuvaksi tuontitiedostoksi.
      </p>
      <Info title="Tietoja sovelluksesta" expandable>
        <p>
          ELSA → MyClub Excel Muuntaja on HNMKY Stadi 2014 tyttöjen jokukkueenjohtajan,
          Timo Kirkkalan koodaama sovellus jolla vähennetään manuaalisen työn määrää
          pelien siirtämisessä {" "}
          <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
            eLSA
          </a>
          :sta {" "}
          <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
            MyClub
          </a>
          :n tapahtumahallintaan.
          </p>
          <p>Sovelluksen koodi on julkaistu avoimena lähdekoodina{" "}
          <a href={SITE_CONFIG.links.githubAppRepoUrl} target="_blank" rel="noopener noreferrer">
            GitHubissa
          </a>.
        </p>
        <h3>Kenelle sovellus on tarkoitettu?</h3>
        <p>
          <a href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
            HNMKY
          </a>
          :n joukkueet voivat valita ryhmän nimen valintalistalta mutta myös muut kuin Namikan
          joukkueet on otettu huomioon sovellusta kehittäessä, MyClub ryhmän nimen voi siis antaa
          myös käsin kirjoitettuna.
        </p>
        <h3>Löysitkö bugin?</h3>
        <p>
          Jos löysit bugin tai keksit parannusehdotuksen, laita Timolle sähköpostia: {" "}
          <a href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>{" "}
          tai osallistu lähdekoodin kehittämiseen {" "}
          <a href="https://github.com/kirkkala/elsa-myclub" target="_blank" rel="noopener noreferrer">
            GitHubissa
          </a>.
        </p>
        <h3>Tietosuojaseloste</h3>
        <p>
          Sovellus ei kerää tietoa käyttäjästä, ainoastaan vähän statistiikkaa kävijämääristä.
          Sovellukseen ladattuja excel-tiedostoja ei tallenneta mihinkään muualle kuin käyttäjän
          omalle tietokoneelle. Keksejä eli niitä herkullisia evästeitäkään ei täällä käytetä 🍪
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
