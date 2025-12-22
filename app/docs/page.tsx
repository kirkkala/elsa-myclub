import type { Metadata } from "next"
import Image from "next/image"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import MuiLink from "@mui/material/Link"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { LuBookMarked, LuGithub } from "react-icons/lu"
import { SITE_CONFIG } from "../../config"
import Layout from "../../components/Layout/Layout"
import Header from "../../components/Header/Header"
import Info from "../../components/Info/Info"
import BackLink from "../../components/BackLink/BackLink"
import Footer from "../../components/Footer/Footer"
import InternalLink from "../../components/InternalLink/InternalLink"
import Divider from "@mui/material/Divider"

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
        <Typography>
          {SITE_CONFIG.name}n avulla voit muuntaa{" "}
          <MuiLink href={SITE_CONFIG.links.elsa} target="_blank" rel="noopener noreferrer">
            eLSA
          </MuiLink>
          :sta ladatun joukkeen sarjapelien Excel-tiedoston{" "}
          <MuiLink href={SITE_CONFIG.links.myclub} target="_blank" rel="noopener noreferrer">
            MyClub
          </MuiLink>
          :in kanssa yhteensopivaksi tuontitiedostoksi.
        </Typography>
        <Typography variant="h3">Kenelle sovellus on tarkoitettu?</Typography>
        <Typography>
          Sovellus on avoin ja vapaasti käytettävissä kenelle tahansa koripalloseuran
          taustahenkilölle ketkä siirtävät otteluita eLSA:sta MyClub:iin.
        </Typography>
        <Typography>
          <MuiLink href="https://www.hnmky.fi" target="_blank" rel="noopener noreferrer">
            Helsingin NMKY
          </MuiLink>{" "}
          seuran joukkueiden ryhmät on valittavissa listalta mutta joukkueen nimen voi antaa myös
          käsin niin myös muiden seurojen joukkueet voivat vapaasti hyödyntää sovellusta.
        </Typography>
        <Typography variant="h3">Tietosuojaseloste</Typography>
        <Typography>
          Sovellus ei kerää tietoa käyttäjistä tai sovellukseen ladatuista tiedostoista.
          Sovellukseen ladattuja tiedostoja ei tallenneta muualle kuin käyttäjän omalle
          tietokoneelle.
        </Typography>
        <Typography>
          Sovelluksen käytöstä kerätään yksilöimätöntä statistiikkaa analytiikkaa varten. Sivusto ei
          tallenna evästeitä eli keksejä käyttäjän tietokoneelle.
        </Typography>
      </Info>

      <Info title="Käyttöohjeet" expandable defaultOpen={false}>
        <Typography variant="h3">1. Hae ottelutiedosto eLSA:sta</Typography>
        <Typography>
          Kirjaudu{" "}
          <MuiLink href="https://elsa.basket.fi" target="_blank" rel="noopener noreferrer">
            elsa.basket.fi
          </MuiLink>
          , valitse joukkue ja siirry &quot;Ottelut&quot;-välilehdelle. Lataa Excel-tiedosto omalle
          tietokoneellesi.
        </Typography>
        <Box>
          <Image
            src="/images/docs/elsa-excel-download.png"
            alt="eLSA Excel-tiedoston lataaminen"
            width={887}
            height={346}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>

        <Typography variant="h3">2. Vie tiedosto sovellukseen</Typography>
        <Typography>
          Siirry sovelluksen <InternalLink href="/">etusivulle</InternalLink> ja valitse eLSA:sta
          lataamasi Excel kohtaan &quot;<strong>eLSA excel tiedosto</strong>&quot;.
        </Typography>
        <Typography>
          eLSA:sta lataamassasi tiedostossa saattaa olla jo pelattuja sekä päivämäärättömiä
          otteluita. Ne voi jättää tiedostoon, muuntaja ei käsittelee niitä.
        </Typography>

        <Typography variant="h3">3. Säädä asetukset</Typography>
        <Box component="ul">
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
            <strong>Ilmoittautuminen</strong>: Kenelle tapahtuma näkyy MyClubissa. &quot;Valituille
            henkilöille&quot; on usein paras valinta sarjapeleihin.
          </li>
        </Box>

        <Typography variant="h3">4. Esikatsele ja lataa</Typography>
        <Typography>
          Tarkastele muunnosta esikatelussa, ja paina &quot;Lataa Excel&quot; saadaksesi
          ottelutiedoston omalle tietokoneellesi. Voit tarvittaessa muokata tiedostoa lataamisen
          jälkeen.
        </Typography>

        <Typography variant="h3">5. Tuo ottelutiedosto MyClubiin</Typography>
        <Typography>
          Kirjaudu MyClubiin ja siirry kohtaan &quot;Tapahtumien hallinta&quot; → &quot;Tuo
          tapahtumia&quot;.
        </Typography>
        <Typography>
          Katso myös MyClubin ohjeet:{" "}
          <MuiLink
            href="https://docs.myclub.fi/article/1213-tapahtumien-tuonti"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tapahtumien tuonti
          </MuiLink>
          .
        </Typography>
      </Info>

      <Info title="Lisätietoja ja palaute" expandable defaultOpen={false}>
        <Typography>
          Löysitkö bugin tai keksit parannusehdotuksen?
          <br />→ Laita viestiä Timolle osoitteeseen{" "}
          <MuiLink href="mailto:timo.kirkkala@gmail.com">timo.kirkkala@gmail.com</MuiLink>.
        </Typography>
        <Typography>
          Haluatko osallistua sovelluksen kehittämiseen?
          <br />→ Katso koodit GitHubissa ja tee pull request.
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <LuBookMarked /> <InternalLink href="/changelog">Versiohistoria</InternalLink>
          </ListItem>
          <ListItem>
            <LuGithub /> Lähdekoodi{" "}
            <MuiLink
              href={SITE_CONFIG.links.githubAppRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubissa
            </MuiLink>
          </ListItem>
        </List>
      </Info>
      <BackLink />
      <Footer />
    </Layout>
  )
}
