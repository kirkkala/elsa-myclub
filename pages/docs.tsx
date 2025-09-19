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
        description="Ohjeet ja tietoa ELSA → MyClub sovelluksen käytöstä"
        ogTitle={`${SITE_CONFIG.name} dokumentaatio`}
        ogDescription="Lue käyttöohjeet ja tietoa sovelluksen käytöstä"
      />
      <Layout>
        <Header />
        <BackLink />
        <Info title="Tietoja sovelluksesta" expandable defaultOpen={false}>
          <p>
            {SITE_CONFIG.name}n avulla siirrät pelit helposti{" "}
            <a href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
              eLSA
            </a>
            :sta{" "}
            <a href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
              MyClub
            </a>:in{" "}
            tapahtumahallintajärjestelmään.
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
            :n joukkueiden ryhmät on valittavissa listalta mutta joukkueen nimen voi antaa myös
            käsin niin muidenkin seurojen joukkueet voivat hyödyntää sovellusta.
          </p>
          <h3>Tietosuojaseloste</h3>
          <p>
            Sovellus ei kerää tietoa käyttäjistä, ainoastaan yksilöimätöntä statistiikkaa
            kävijämääristä. Sovellukseen ladattuja tiedostoja ei tallenneta mihinkään muualle kuin
            käyttäjän omalle tietokoneelle. Keksejä eli evästeitäkään ei täällä käytetä.
          </p>
        </Info>

        <Info title="Käyttöohjeet" expandable defaultOpen={false}>
          <ol>
            <li>
              <strong>Lataa excel-tiedosto eLSA:sta</strong>
              <p>
                Kirjaudu eLSA-järjestelmään ja hae joukkueesi pelit. Lataa tulokset Excel-muodossa.
              </p>
            </li>
            <li>
              <strong>Valitse tiedosto sovelluksessa</strong>
              <p>Klikkaa "Valitse tiedosto..." ja valitse ladattu Excel-tiedosto.</p>
            </li>
            <li>
              <strong>Säädä asetukset</strong>
              <p>
                Valitse joukkueesi nimi, vuosi, kokoontumisaika ja muut asetukset joukkueellesi
                sopiviksi.
              </p>
            </li>
            <li>
              <strong>Esikatsele tulosta</strong>
              <p>Tarkista että tiedot näyttävät oikeilta esikatselussa.</p>
            </li>
            <li>
              <strong>Lataa MyClub-tiedosto</strong>
              <p>Klikkaa "Lataa Excel" ja tallenna tiedosto tietokoneellesi.</p>
            </li>
            <li>
              <strong>Tuo tiedosto MyClub:iin</strong>
              <p>
                Kirjaudu MyClub:iin, siirry tapahtumien hallintaan ja valitse "Tuo tapahtumia".
                Lataa tallentamasi tiedosto.
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
