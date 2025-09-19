import { LuChevronDown, LuChevronRight } from "react-icons/lu"
import styles from "./Info.module.scss"

interface InfoProps {
  title: string
  expandable?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function Info({
  title,
  expandable = true,
  defaultOpen = false,
  children,
}: InfoProps) {
  if (expandable) {
    return (
      <details className={styles.info} open={defaultOpen}>
        <summary
          role="button"
          aria-label={defaultOpen ? "Piilota" : "Näytä lisää"}
          aria-expanded={defaultOpen ? "true" : "false"}
          onClick={(e) => {
            const details = e.currentTarget.parentElement as HTMLDetailsElement
            e.currentTarget.setAttribute("aria-label", details.open ? "Näytä lisää" : "Piilota")
            e.currentTarget.setAttribute("aria-expanded", details.open ? "false" : "true")
          }}
        >
          <h2 className={styles.summaryTitle}>{title}</h2>
          <span className={styles.summaryClosed}>
            <LuChevronRight className={styles.icon} />
          </span>
          <span className={styles.summaryOpen}>
            <LuChevronDown className={styles.icon} />
          </span>
        </summary>
        <div className={`${styles.infoContent} ${styles.expandable}`}>{children}</div>
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
