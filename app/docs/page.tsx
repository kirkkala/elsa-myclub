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
          taustahenkilölle ketkä siirtävät pelejä eLSA:sta MyClub:iin.
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
          Applikaation käytöstä kerätään yksilöimätöntä statistiikkaa analytiikkaa varten. Sivusto
          ei tallenna evästeitä eli keksejä käyttäjän tietokoneelle.
        </p>
      </Info>

      <Info title="Käyttöohjeet" expandable defaultOpen={false}>
        <ol>
          <li>
            <strong>Hae ottelut eLSA:sta</strong>
            <p>
              Kirjaudu{" "}
              <Link href="https://elsa.basket.fi" target="_blank" rel="noopener noreferrer">
                elsa.basket.fi
              </Link>
              , siirry joukkueesi "Ottelut" -välilehdelle ja lataa ottelutiedosto Excel-muodossa.
              <Image
                src="/images/docs/elsa-excel-download.png"
                alt="eLSA Excel-tiedoston lataaminen"
                width={887}
                height={346}
                className="image-embed"
              />
            </p>
          </li>
          <li>
            <strong>Siirrä tiedosto sovellukseen</strong>
            <p>
              Mene sovelluksen <Link href="/">etusivulle</Link>, "Valitse tiedosto..." ja valitse
              eLSA:sta lataamasi Excel muunnosta varten.
            </p>
          </li>
          <li>
            <strong>Säädä asetukset</strong>
            <ol>
              <li>
                <strong>Joukkue (MyClub ryhmä)</strong>: Tämän tiedon avulla pelien tuonti
                yhdistetään oikeaan ryhmään MyClubissa. Valitse joukkueesi listalta tai kirjoita
                nimi kuten se on MyClubissa mikäli joukkueesi ei ole valintalistalla.
              </li>
              <li>
                <strong>Vuosi</strong>: eLSA tiedostosta puuttuu vuosiluku päivämäärien yhteydessä
                joten vuosi tulee valita. Mikäli tiedoston pelit osuvat ovat eri vuosille, voit
                muokata niitä excelissä omalla koneellasi tiedoston lataamisen jälkeen.
              </li>
              <li>
                <strong>Kokoontumisaika</strong>: Valitse kuinka paljon ennen ottelun alkua
                joukkueen tulee olla paikalla lämmittelyä varten. Valinta aikaistaa tapahtuman
                alkuaikaa MyClubissa sekä lisää MyClub-tapahtuman kuvaukseen tiedon erikseen lämppä-
                ja otteluajan alusta.
              </li>
              <li>
                <strong>Tapahtuman kesto</strong>: Valitse tapahtuman kesto. Tämän perusteella
                lasketaan tapahtuman alkamis- ja päättymisaika mahdollinen kokoontumisaika
                huomioiden.
              </li>
              <li>
                <strong>Tapahtumatyyppi</strong>: Valitse tapahtuman tyyppi MyClubiin. "Ottelu" on
                yleensä paras valinta sarjapelejä varten.
              </li>
              <li>
                <strong>Ilmoittautuminen</strong>: Valitse kenelle ilmoittautuminen tapahtumaan
                MyClubissa on sallittu. "Valituille henkilöille" on yleensä paras valinta
                sarjapeleille. Näin valmentaja voi avata ilmoittautumisen vain kokoonpanoon
                lisätyille pelaajille.
              </li>
            </ol>
          </li>
          <li>
            <strong>Esikatsele muunnosta</strong>
            <p>
              Voit esikatsella muunnostiedoston sisältöä ennen sen lataamista omalle koneelle.
              Esikatselu päivittyy reaaliaikaisesti kun muutat asetuksia.
            </p>
          </li>
          <li>
            <strong>Lataa tiedosto</strong>
            <p>
              Kun näyttää hyvältä, painma "Lataa Excel" ja tallenna tiedosto tietokoneellesi.
              Tarvittaessa voit muokata muunnostiedostoa omalla koneellasi lataamisen jälkeen.
            </p>
          </li>
          <li>
            <strong>Vie tiedosto MyClub:iin</strong>
            <p>Kirjaudu MyClub:iin, siirry tapahtumien hallintaan ja valitse "Tuo tapahtumia".</p>
            <p>
              Ohjeet MyClubin dokumentaatiossa:{" "}
              <Link
                href="https://docs.myclub.fi/article/1213-tapahtumien-tuonti"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tapahtumat → Tapahtumien tuonti
              </Link>
              .
            </p>
          </li>
        </ol>
      </Info>

      <Info title="Lisätietoja ja palaute" expandable defaultOpen={false}>
        <p>
          Löysitkö bugin tai keksit parannusehdotuksen?
          <br />
          Laita viestiä Timolle osoitteeseen{" "}
          <a href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</a>.
        </p>
        <p>
          Haluatko osallistua applikaation kehittämiseen?
          <br />
          Katso koodit GitHubissa ja tee pull request.
        </p>
        <hr />
        <ul className="list-reset">
          <li>
            <LuBookMarked /> Sovelluksen <Link href="/changelog">versiohistoria</Link>
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
