import styles from './Info.module.scss'
import { LuInfo, LuX } from "react-icons/lu"

interface InfoProps {
  title: string
  expandable?: boolean
  children: React.ReactNode
}

export default function Info({ title, expandable = true, children }: InfoProps) {
  if (expandable) {
    return (
      <details className={styles.info}>
        <summary>
          <span className={styles.summaryClosed}><LuInfo className={styles.icon} /> {title}</span>
          <span className={styles.summaryOpen}><LuX /></span>
        </summary>
        <div className={styles.infoContent}>
          <h2>{title}</h2>
          {children}
        </div>
      </details>
    )
  }

  return (
    <div className={styles.info}>
      <h2>{title}</h2>
      <div className={styles.infoContent}>
        {children}
      </div>
    </div>
  )
}
