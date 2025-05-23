import { IconType } from "react-icons"
import styles from "./TextInput.module.scss"

interface TextInputProps {
  id: string
  label: string
  description?: string
  Icon: IconType
  placeholder?: string
  defaultValue?: string
  required?: boolean
  suffix?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function TextInput({
  id,
  label,
  description,
  Icon,
  placeholder,
  defaultValue,
  required = false,
  suffix,
  onChange,
  disabled,
}: TextInputProps): React.ReactElement {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        <Icon /> {label}
      </label>
      {description && (
        <div id={`${id}-description`} className={styles.fieldDescription}>
          {description}
        </div>
      )}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          aria-describedby={description ? `${id}-description` : undefined}
          onChange={onChange}
          disabled={disabled}
        />
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
    </div>
  )
}
