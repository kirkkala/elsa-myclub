import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import UploadForm from "../components/Form/UploadForm/UploadForm"
import Footer from "../components/Footer/Footer"
import InfoButton from "../components/InfoButton/InfoButton"
import { SEO_CONFIG } from "../config"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SEO_CONFIG.pages.home.title,
    description: SEO_CONFIG.pages.home.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  }

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography sx={{ mb: 2 }}>
          Muunna eLSA:n excel tiedostot MyClub-yhteensopiviksi parilla klikkauksella. Helpota
          jojotöitä ja säästä aikaa.
        </Typography>
        <InfoButton />
      </Box>
      <UploadForm />
      <Footer />
    </Layout>
  )
}
