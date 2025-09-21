import Link from "next/link"
import { LuBookMarked, LuGithub } from "react-icons/lu"
import { SITE_CONFIG } from "../config"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import Info from "../components/Info/Info"
import BackLink from "../components/BackLink/BackLink"
import Footer from "../components/Footer/Footer"
import Head from "../components/Head/Head"

export default function Docs() {
  return (
    <>
      <Head
        title={`Dokumentaatio ${SITE_CONFIG.name}`}
        description="Ohjeet ja tietoa eLSA → MyClub sovelluksen käytöstä"
        ogTitle={`${SITE_CONFIG.name} dokumentaatio`}
        ogDescription="Lue käyttöohjeet ja tietoa sovelluksen käytöstä"
      />
      <Layout>
        <Header />
        <BackLink />
        <Info title="Tietoja sovelluksesta" expandable defaultOpen={false}>
          <p>
            {SITE_CONFIG.name}n avulla voit tehdä{" "}
            <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
              eLSA
            </a>
            :sta ladatun joukkeen sarjapelien excel-tiedoston{" "}
            <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
              MyClub
            </a>
            :in kanssa yhteensopivaksi tuontitiedostoksi.
          </p>
          <h3>Kenelle sovellus on tarkoitettu?</h3>
          <p>
            Sovellus on avoin ja vapaasti käytettävissä kenelle tahansa koripalloseuran
            taustahenkilölle ketkä siirtävät pelejä eLSA:sta MyClub:iin.
          </p>
          <p>
            <a href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
              Helsingin NMKY
            </a>
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
                Kirjaudu https://elsa.basket.fi ja siirry "ottelut" -sivulle. Lataa ottelutiedosto
                Excel-muodossa. [KUVA]
              </p>
            </li>
            <li>
              <strong>Valitse tiedosto sovelluksessa</strong>
              <p>
                Paina "Valitse tiedosto..." ja siirrä eLSA:sta ladattu Excel-tiedosto sivustolle
                muunnosta varten.
              </p>
            </li>
            <li>
              <strong>Säädä asetukset</strong>
              <br />
              Säädä asetukset joukkueellesi sopiviksi:
              <ol>
                <li>
                  <strong>Joukkue (MyClub ryhmä)</strong>: Joukkueesi nimi kuten se on MyClubissa.
                  Valitse joko listalta tai kirjoita nimi itse jos joukkueesi ei ole listalla. Tämän
                  avulla pelien tuonti yhdistetään oikeaan ryhmään MyClubissa.
                </li>
                <li>
                  <strong>Vuosi</strong>: eLSA tiedostosta puuttuu vuosiluku päivämäärien yhteydessä
                  joten vuosi tulee asettaa tässä. Mikäli pelisi ovat eri vuosille, voit muokata
                  tämän muunnostiedoston omalla koneellasi lataamisen.
                </li>
                <li>
                  <strong>Kokoontumisaika</strong>: Valitse kuinka monta minuuttia ennen ottelun
                  alkua joukkueen tulee olla paikalla lämmittelyä varten. Valinta aikaistaa
                  tapahtuman alkuaikaa MyClubissa valinnan verran ja lisää MyClub-tapahtuman
                  kuvaukseen tiedon lämppä- ja otteluajan alusta.
                </li>
                <li>
                  <strong>Tapahtuman kesto</strong>: Valitse tapahtuman kesto. Tämän perusteella
                  lasketaan tapahtuman alkamis- ja päättymisaika kokoontumisaika huomioiden.
                </li>
                <li>
                  <strong>Tapahtumatyyppi</strong>: Valitse tapahtuman tyyppi MyClubiin. Yleensä
                  "Ottelu" sarjapeleille.
                </li>
                <li>
                  <strong>Ilmoittautuminen</strong>: Valitse kenelle ilmoittautuminen tapahtumaan
                  MyClubissa on sallittu. "Valituille henkilöille" on yleensä paras valinta
                  joukkuepeleille. Näin valmentaja voi avata ilmoittautumisen vain kokoonpanoon
                  lisätyille pelaajille.
                </li>
              </ol>
            </li>
            <li>
              <strong>Esikatsele tulosta</strong>
              <p>
                Voit esikatsella muunnostiedoston sisältöä ennen lataamista omalle koneellesi.
                Esikatselu päivittyy reaaliaikaisesti kun muutat asetuksia.
              </p>
            </li>
            <li>
              <strong>Lataa MyClub-tiedosto</strong>
              <p>
                Kun näyttää hyvältä, painma "Lataa Excel" ja tallenna tiedosto tietokoneellesi.
                Tarvittaessa voit muokata muunnostiedostoa omalla koneellasi lataamisen jälkeen.
              </p>
            </li>
            <li>
              <strong>Tuo tiedosto MyClub:iin</strong>
              <p>Kirjaudu MyClub:iin, siirry tapahtumien hallintaan ja valitse "Tuo tapahtumia".</p>
              <p>
                Katso tarkemmat ohjeet MyClubin dokumentaatiosta{" "}
                <a
                  href="https://docs.myclub.fi/article/1213-tapahtumien-tuonti"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tapahtumat → Tapahtumien tuonti
                </a>
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
            Haluatko osallistua lähdekoodin kehittämiseen?
            <br />
            Katso koodit{" "}
            <a
              href="https://github.com/kirkkala/elsa-myclub"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubissa
            </a>{" "}
            ja tee pull request.
          </p>
          <hr />
          <ul className="list-reset">
            <li>
              <LuBookMarked /> Sovelluksen <Link href="/changelog">versiohistoria</Link>
            </li>
            <li>
              <LuGithub /> Lähdekoodi{" "}
              <a
                href={SITE_CONFIG.links.githubAppRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHubissa
              </a>
            </li>
          </ul>
        </Info>
        <BackLink />
        <Footer />
      </Layout>
    </>
  )
}
