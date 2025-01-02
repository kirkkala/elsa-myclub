import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './Header.module.scss'
import { SITE_CONFIG } from '../../config'
import { LuWandSparkles } from "react-icons/lu"

export default function Header() {
  const router = useRouter()
  const isChangelog = router.pathname === '/changelog'

  return (
    <div className={isChangelog ? styles.header : styles.headerWithLogos}>
      {!isChangelog && (
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
      )}
      <h1>{SITE_CONFIG.name}</h1>
      <p>{SITE_CONFIG.version} {!isChangelog && (<Link href="/changelog">(<small>versiohistoria</small>)</Link>)}</p>
    </div>
  )
}

