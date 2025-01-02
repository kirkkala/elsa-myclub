import styles from '../styles/Main.module.scss'
import Header from '../components/Header/Header'
import Info from '../components/Info/Info'
import UploadForm from '../components/Form/UploadForm/UploadForm'
import Footer from '../components/Footer/Footer'

export default function Home() {

  return (
    <div className={styles.container}>
      <Header />
      <p>
        Muunna <a className={styles.link}
          href="https://elsa.basket.fi/"
          target="_blank"
          rel="noopener noreferrer">ELSA</a>:sta
        ladattu excel tiedosto <a className={styles.link}
          href="https://hnmky.myclub.fi/"
          target="_blank"
          rel="noopener noreferrer">MyClub</a>:iin soveltuvaksi tuontitiedostoksi.
      </p>

      <Info />
      <UploadForm />
      <Footer />


    </div>
  )
}
