import { LuChevronDown, LuChevronRight } from "react-icons/lu"
import { useEffect } from "react"
import styles from "./Info.module.scss"

interface InfoProps {
  title: string
  expandable?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  id?: string
}

// Helper function to generate URL-safe ID from title
const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Helper function to get open sections from URL hash
const getOpenSections = (): string[] => {
  if (typeof window === "undefined") {
    return []
  }
  const hash = window.location.hash.substring(1)
  return hash ? hash.split(",").filter(Boolean) : []
}

// Helper function to update URL hash with open sections
const updateUrlHash = (openSections: string[]): void => {
  if (typeof window === "undefined") {
    return
  }

  if (openSections.length > 0) {
    window.history.replaceState(null, "", `#${openSections.join(",")}`)
  } else {
    const url = window.location.pathname + window.location.search
    window.history.replaceState(null, "", url)
  }
}

export default function Info({
  title,
  expandable = true,
  defaultOpen = false,
  children,
  id,
}: InfoProps) {
  const sectionId = id || generateId(title)

  // Check URL hash on mount and open if matches
  useEffect(() => {
    const openSections = getOpenSections()
    if (openSections.includes(sectionId)) {
      const details = document.getElementById(sectionId) as HTMLDetailsElement | null
      if (details) {
        details.open = true
      }
    }
  }, [sectionId])

  const handleToggle = () => {
    // Update URL hash after the toggle
    setTimeout(() => {
      const openSections = getOpenSections()
      const details = document.getElementById(sectionId) as HTMLDetailsElement | null

      if (details?.open) {
        // Add section to hash if not already there
        if (!openSections.includes(sectionId)) {
          openSections.push(sectionId)
        }
      } else {
        // Remove section from hash
        const index = openSections.indexOf(sectionId)
        if (index > -1) {
          openSections.splice(index, 1)
        }
      }

      updateUrlHash(openSections)
    }, 0)
  }

  if (expandable) {
    return (
      <details className={styles.info} open={defaultOpen} id={sectionId} onToggle={handleToggle}>
        <summary role="button">
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
