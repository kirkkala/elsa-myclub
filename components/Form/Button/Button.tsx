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

export default function Button({ children, ...props }: ButtonProps): React.ReactElement {
  return (
    <div className={styles.formGroup}>
      {props.label && (
        <label>
          {props.Icon && <props.Icon />}
          {props.label}
        </label>
      )}
      {props.description && <div className={styles.fieldDescription}>{props.description}</div>}
      <button type={props.type} disabled={props.disabled} className={styles.button}>
        {children}
      </button>
    </div>
  )
}
