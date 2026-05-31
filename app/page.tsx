import Footer from "../components/Footer/Footer"
import UploadForm from "../components/Form/UploadForm/UploadForm"
import Layout from "../components/Layout/Layout"
import { SEO_CONFIG } from "../config"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
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
      <UploadForm />
      <Footer />
    </Layout>
  )
}
