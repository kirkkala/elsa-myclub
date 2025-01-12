import Link from 'next/link'
import { LuBookMarked, LuGithub } from "react-icons/lu"
import { SITE_CONFIG } from '../config'
import Layout from '../components/Layout/Layout'
import Header from '../components/Header/Header'
import Info from '../components/Info/Info'
import UploadForm from '../components/Form/UploadForm/UploadForm'
import Footer from '../components/Footer/Footer'

export default function Home() {
  return (
    <Layout>
      <Header />
      <p>
        Helpota jojotöitä ja muunna <a
          href={SITE_CONFIG.links.elsa}
          target="_blank"
          rel="noopener noreferrer">eLSA</a>:sta
        ladattu excel <a
          href={SITE_CONFIG.links.myclub}
          target="_blank"
          rel="noopener noreferrer">MyClub</a>:iin soveltuvaksi tuontitiedostoksi.
      </p>
      <Info title="Tietoja sovelluksesta" expandable>
        <p>
          Tämä on Namikan Stadi 2014 tyttöjen jojon Timo Kirkkalan tekemä avoimen
          lähdekoodin sovellus jonka tavoite on vähentää manuaalisen työn määrää
          kun halutaan siirtää <a
            href={SITE_CONFIG.links.elsa}
            target="_blank"
            rel="noopener noreferrer">eLSA</a>
            :sta pelejä <a
            href={SITE_CONFIG.links.myclub}
            target="_blank"
            rel="noopener noreferrer">MyClub</a>:iin.
        </p>
        <p>Sovellus on vielä betaversiossa ja mahdollisesti buginen. Tavoitteena
          on tehdä tästä &ldquo;bulletproof&rdquo; syksylle 2025 kun jojot seuraavan
          kerran päääsevät siirtämään otteluita ELSA:sta MyClub:iin. Hyvän  pelihengen
          nimissä myös muut kuin Namikalaiset saavat käyttää sovellusta.</p>
        <p>
          Tsemppiä peleihin ja koko ruljanssin pyörittämiseen, HOS! 💪🏀
        </p>
        <h3>Tietosuojaseloste</h3>
        <p>
          Sovellus ei kerää tietoa käyttäjästä, ainoastaan vähän statistiikkaa
          kävijämääristä. Sivustolle ladattuja excel-tiedostoja ei tallenneta
          mihinkään muualle kuin käyttäjän omalle tietokoneelle. Keksejäkään eli
          niitä herkullisia evästeitäkään ei täällä käytetä 🍪
        </p>
        <hr />
        <ul className="list-reset">
          <li><LuBookMarked /> Sovelluksen <Link href="/changelog">versiohistoria</Link></li>
          <li><LuGithub /> Lähdekoodi <a
            href={SITE_CONFIG.links.githubAppRepoUrl}
            target="_blank"
            rel="noopener noreferrer">GitHubissa</a></li>
        </ul>
      </Info>
      <UploadForm />
      <Footer />
    </Layout>
  )
}
