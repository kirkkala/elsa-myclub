import { IconType } from 'react-icons'
import styles from './TextInput.module.scss'

interface TextInputProps {
  id: string
  label: string
  description: React.ReactNode
  Icon: IconType
  placeholder?: string
  defaultValue?: string
  required?: boolean
}

export default function TextInput({
  id,
  label,
  description,
  Icon,
  placeholder,
  defaultValue,
  required = false
}: TextInputProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        <Icon /> {label}
      </label>
      <p id={`${id}-description`} className={styles.fieldDescription}>
        {description}
      </p>
      <input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        aria-describedby={`${id}-description`}
      />
    </div>
  )
}
