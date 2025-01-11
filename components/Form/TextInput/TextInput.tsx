import { IconType } from 'react-icons'
import styles from './TextInput.module.scss'

interface TextInputProps {
  id: string
  label: string
  description: string
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
      <label>
        <Icon /> {label}
      </label>
      <p className={styles.fieldDescription}>
        {description}
      </p>
      <input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  )
}
