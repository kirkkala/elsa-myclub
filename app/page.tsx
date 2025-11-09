import Link from "next/link"
import { LuInfo } from "react-icons/lu"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import UploadForm from "../components/Form/UploadForm/UploadForm"
import Footer from "../components/Footer/Footer"
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
      <div className="intro-section">
        <p className="intro-text">
          Muunna eLSA:n excel tiedostot MyClub-yhteensopiviksi parilla klikkauksella. Helpota
          jojotöitä ja säästä aikaa.
        </p>
        <Link href="/docs" className="btn-info">
          <LuInfo size={20} />
          <span>Käyttöohjeet ja tietoja sovelluksesta</span>
        </Link>
      </div>
      <h2 className="visually-hidden">Konversiolomake</h2>
      <UploadForm />
      <Footer />
    </Layout>
  )
}
