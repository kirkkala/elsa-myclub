import Image from "next/image"
import Link from "next/link"
import styles from "./Header.module.scss"
import { SITE_CONFIG } from "../../config"
import { LuWandSparkles } from "react-icons/lu"

export default function Header() {
  return (
    <header className={styles.headerWithLogos}>
      <div className={styles.titleLogos}>
        <Image
          src="/images/elsa.png"
          alt="ELSA"
          width={25}
          height={20}
          className={`${styles.titleLogo} ${styles.elsaLogo}`}
        />
        <LuWandSparkles className={styles.titleArrow} />
        <Image
          src="/images/myclub.svg"
          alt="MyClub"
          width={45}
          height={45}
          className={`${styles.titleLogo} ${styles.myclubLogo}`}
        />
      </div>
      <div className={styles.titleWithBadge}>
        <h1>{SITE_CONFIG.name}</h1>
        <Link
          href="/changelog"
          title="Sovelluksen versiohistoria"
          className={styles.versionBadge}
        >
          <small>{SITE_CONFIG.version}</small>
        </Link>
      </div>
    </header>
  )
}
