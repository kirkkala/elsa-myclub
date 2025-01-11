import { IconType } from 'react-icons'
import styles from './SelectField.module.scss'

interface SelectFieldProps {
  id: string
  label: string
  description: string
  Icon: IconType
  options: Array<{
    value: string
    label: string
  }>
  defaultValue?: string
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  defaultValue
}: SelectFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label>
        <Icon /> {label}
      </label>
      <p className={styles.fieldDescription}>
        {description}
      </p>
      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
      >
        <option value="">- Valitse -</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
