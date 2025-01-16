import { LuInfo, LuX } from "react-icons/lu"
import styles from "./Info.module.scss"

interface InfoProps {
  title: string
  expandable?: boolean
  children: React.ReactNode
}

export default function Info({ title, expandable = true, children }: InfoProps): React.ReactElement {
  if (expandable) {
    return (
      <details className={styles.info}>
        <summary
          role="button"
          aria-label="Näytä lisää"
          aria-expanded="false"
          onClick={(e) => {
            const details = e.currentTarget.parentElement as HTMLDetailsElement
            e.currentTarget.setAttribute("aria-label", details.open ? "Näytä lisää" : "Piilota")
            e.currentTarget.setAttribute("aria-expanded", details.open ? "false" : "true")
          }}
        >
          <span className={styles.summaryClosed}>
            <LuInfo className={styles.icon} /> {title}
          </span>
          <span className={styles.summaryOpen}>
            <LuX />
          </span>
        </summary>
        <div className={`${styles.infoContent} ${styles.expandable}`}>
          <h2>{title}</h2>
          {children}
        </div>
      </details>
    )
  }

  return (
    <div className={styles.info}>
      <div className={styles.infoContent}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}
