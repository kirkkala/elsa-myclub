import Link from 'next/link'
import styles from '../../styles/Main.module.scss'

export default function BackLink() {
  return (
    <p className={styles.backLink}>
      <Link href="/">← Takaisin</Link>
    </p>
  )
}
