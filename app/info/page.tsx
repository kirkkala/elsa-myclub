import GitHubIcon from "@mui/icons-material/GitHub"
import HistoryIcon from "@mui/icons-material/History"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import MuiLink from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import type { Metadata } from "next"

import Footer from "../../components/Footer/Footer"
import Layout from "../../components/Layout/Layout"
import { SITE_CONFIG } from "../../config"

export const metadata: Metadata = {
  title: "Tietoja",
}

export default function Info() {
  return (
    <Layout>
      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1">
          Tietoa sovelluksesta
        </Typography>
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
      </Box>

      <Box component="section" sx={{ mb: 4 }}>
        <Typography variant="h2" component="h2">
          Lisätietoja ja palaute
        </Typography>
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
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 0.5 }}>
            <HistoryIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            <MuiLink href="/changelog">Versiohistoria</MuiLink>
          </Typography>
          <Typography>
            <GitHubIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            Lähdekoodi{" "}
            <MuiLink
              href={SITE_CONFIG.links.githubAppRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubissa
            </MuiLink>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Layout>
  )
}
