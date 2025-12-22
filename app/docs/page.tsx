import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { LuBookMarked, LuGithub } from "react-icons/lu"
import { SITE_CONFIG } from "../../config"
import Layout from "../../components/Layout/Layout"
import Header from "../../components/Header/Header"
import Info from "../../components/Info/Info"
import BackLink from "../../components/BackLink/BackLink"
import Footer from "../../components/Footer/Footer"

export const metadata: Metadata = {
  title: `Dokumentaatio`,
  description: "Ohjeet ja tietoa eLSA → MyClub sovelluksen käytöstä",
  openGraph: {
    title: `${SITE_CONFIG.name} dokumentaatio`,
    description: "Lue käyttöohjeet ja tietoa sovelluksen käytöstä",
  },
}

export default function Docs() {
  return (
    <Layout>
      <Header />
      <BackLink />
      <Info title="Tietoja sovelluksesta" expandable defaultOpen={false}>
        <p>
          {SITE_CONFIG.name}n avulla voit muuntaa{" "}
          <Link href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
            eLSA
          </Link>
          :sta ladatun joukkeen sarjapelien Excel-tiedoston{" "}
          <Link href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
            MyClub
          </Link>
          :in kanssa yhteensopivaksi tuontitiedostoksi.
        </p>
        <h3>Kenelle sovellus on tarkoitettu?</h3>
        <p>
          Sovellus on avoin ja vapaasti käytettävissä kenelle tahansa koripalloseuran
          taustahenkilölle ketkä siirtävät otteluita eLSA:sta MyClub:iin.
        </p>
        <p>
          <Link href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
            Helsingin NMKY
          </Link>{" "}
          seuran joukkueiden ryhmät on valittavissa listalta mutta joukkueen nimen voi antaa myös
          käsin niin myös muiden seurojen joukkueet voivat vapaasti hyödyntää sovellusta.
        </p>
        <h3>Tietosuojaseloste</h3>
        <p>
          Sovellus ei kerää tietoa käyttäjistä tai sovellukseen ladatuista tiedostoista.
          Sovellukseen ladattuja tiedostoja ei tallenneta muualle kuin käyttäjän omalle
          tietokoneelle.
        </p>
        <p>
          Sovelluksen käytöstä kerätään yksilöimätöntä statistiikkaa analytiikkaa varten. Sivusto ei
          tallenna evästeitä eli keksejä käyttäjän tietokoneelle.
        </p>
      </Info>

      <Info title="Käyttöohjeet" expandable defaultOpen={false}>
        <h3>1. Hae ottelutiedosto eLSA:sta</h3>
        <p>
          Kirjaudu{" "}
          <Link href="https://elsa.basket.fi" target="_blank" rel="noopener noreferrer">
            elsa.basket.fi
          </Link>
          , valitse joukkue ja siirry "Ottelut"-välilehdelle. Lataa Excel-tiedosto omalle
          tietokoneellesi.
          <Image
            src="/images/docs/elsa-excel-download.png"
            alt="eLSA Excel-tiedoston lataaminen"
            width={887}
            height={346}
            className="image-embed"
          />
        </p>

        <h3>2. Vie tiedosto sovellukseen</h3>
        <p>
          Siirry sovelluksen <Link href="/">etusivulle</Link> ja valitse eLSA:sta lataamasi Excel
          kohtaan "<strong>eLSA excel tiedosto</strong>".
        </p>
        <p>
          eLSA:sta lataamassasi tiedostossa saattaa olla jo pelattuja sekä päivämäärättömiä
          otteluita. Ne voi jättää tiedostoon, muuntaja ei käsittelee niitä.
        </p>

        <h3>3. Säädä asetukset</h3>
        <ul>
          <li>
            <strong>Joukkue</strong>: Valitse listalta tai kirjoita nimi kuten se on MyClubissa.
          </li>
          <li>
            <strong>Vuosi</strong>: eLSA:n tiedostossa ei ole vuosilukuja, se tulee valita erikseen
            jotta MyClub osaa luoda tapahtuman oikein.
          </li>
          <li>
            <strong>Kokoontumisaika</strong>: Aikaistaa tapahtuman alkuaikaa sekä lisää tiedon
            lämppä- ja otteluajan alusta tapahtuman kuvaukseen.
          </li>
          <li>
            <strong>Tapahtuman kesto</strong>: Määrittää tapahtuman keston.
          </li>
          <li>
            <strong>Ilmoittautuminen</strong>: Kenelle tapahtuma näkyy MyClubissa. "Valituille
            henkilöille" on usein paras valinta sarjapeleihin.
          </li>
        </ul>

        <h3>4. Esikatsele ja lataa</h3>
        <p>
          Tarkastele muunnosta esikatelussa, ja paina "Lataa Excel" saadaksesi ottelutiedoston
          omalle tietokoneellesi. Voit tarvittaessa muokata tiedostoa lataamisen jälkeen.
        </p>

        <h3>5.Tuo ottelutiedosto MyClubiin</h3>
        <p>Kirjaudu MyClubiin ja siirry kohtaan "Tapahtumien hallinta" → "Tuo tapahtumia".</p>
        <p>
          Katso myös MyClubin ohjeet:{" "}
          <Link
            href="https://docs.myclub.fi/article/1213-tapahtumien-tuonti"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tapahtumien tuonti
          </Link>
          .
        </p>
      </Info>

      <Info title="Lisätietoja ja palaute" expandable defaultOpen={false}>
        <p>
          Löysitkö bugin tai keksit parannusehdotuksen?
          <br />→ Laita viestiä Timolle osoitteeseen{" "}
          <a href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>.
        </p>
        <p>
          Haluatko osallistua sovelluksen kehittämiseen?
          <br />→ Katso koodit GitHubissa ja tee pull request.
        </p>
        <hr />
        <ul className="list-reset">
          <li>
            <LuBookMarked /> <Link href="/changelog">Versiohistoria</Link>
          </li>
          <li>
            <LuGithub /> Lähdekoodi{" "}
            <Link
              href={SITE_CONFIG.links.githubAppRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubissa
            </Link>
          </li>
        </ul>
      </Info>
      <BackLink />
      <Footer />
    </Layout>
  )
}
