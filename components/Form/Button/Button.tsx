import { IconType } from "react-icons"
import styles from "./Button.module.scss"

interface ButtonProps {
  type?: "button" | "submit"
  disabled?: boolean
  Icon?: IconType
  label?: string
  description?: string
  children: React.ReactNode
}

export default function Button({
  type = "button",
  disabled,
  Icon,
  label,
  description,
  children,
}: ButtonProps) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label>
          {Icon && <Icon />}
          {label}
        </label>
      )}
      {description && <div className={styles.fieldDescription}>{description}</div>}
      <button type={type} disabled={disabled} className={styles.button}>
        {children}
      </button>
    </div>
  )
}
