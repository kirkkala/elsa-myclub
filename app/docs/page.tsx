import Box from "@mui/material/Box"
import MuiLink from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import type { Metadata } from "next"
import Image from "next/image"

import Footer from "../../components/Footer/Footer"
import Layout from "../../components/Layout/Layout"

export const metadata: Metadata = {
  title: "Käyttöohjeet",
}

export default function Docs() {
  return (
    <Layout>
      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1">
          Käyttöohjeet
        </Typography>
        <Typography>
          Käyttöohjeet sovelluksen käyttöön. Seuraa alla listatut vaiheet yksitellen muuntaaksesi
          eLSA:n excel tiedostot MyClub-yhteensopiviksi.
        </Typography>
        <Typography variant="h2">1. Hae ottelutiedosto eLSA:sta</Typography>
        <Typography>
          Kirjaudu{" "}
          <MuiLink href="https://elsa.basket.fi" target="_blank" rel="noopener noreferrer">
            elsa.basket.fi
          </MuiLink>
          , valitse joukkue ja siirry &quot;Ottelut&quot;-välilehdelle. Lataa Excel-tiedosto omalle
          tietokoneellesi.
        </Typography>
        <Box sx={{ mb: 3 }}>
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

        <Typography variant="h2">2. Vie tiedosto(t) sovellukseen</Typography>
        <Typography>
          Siirry sovelluksen <MuiLink href="/">etusivulle</MuiLink> ja pudota tai valitse eLSA:n
          excel-tiedosto niille varattuun kohtaan. Voit halutessasi lisätä useammankin tiedoston.
        </Typography>
        <Typography>
          eLSA:n tiedostossa saattaa olla jo pelattuja sekä päivämäärättömiä otteluita. Ne voi
          jättää tiedostoon, muuntaja ei käsittelee niitä.
        </Typography>

        <Typography variant="h2">3. Säädä asetukset</Typography>
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

        <Typography variant="h2">4. Esikatsele ja lataa</Typography>
        <Typography>
          Tarkastele muunnosta esikatelussa, ja paina &quot;Lataa Excel&quot; saadaksesi
          ottelutiedoston omalle tietokoneellesi. Voit tarvittaessa muokata tiedostoa lataamisen
          jälkeen.
        </Typography>

        <Typography variant="h2">5. Tuo ottelutiedosto MyClubiin</Typography>
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
      </Box>
      <Footer />
    </Layout>
  )
}
