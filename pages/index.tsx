import Link from "next/link"
import { LuInfo } from "react-icons/lu"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import UploadForm from "../components/Form/UploadForm/UploadForm"
import Footer from "../components/Footer/Footer"

export default function Home() {
  return (
    <Layout>
      <Header />
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Link href="/docs" className="btn-info">
          <LuInfo size={16} />
          Tietoja sovelluksesta ja käyttöohjeet
        </Link>
      </div>
      <h2 className="visually-hidden">Konversiolomake</h2>
      <UploadForm />
      <Footer />
    </Layout>
  )
}
