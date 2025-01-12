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
  required?: boolean
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  required
}: SelectFieldProps) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        {Icon && <Icon />}
        {label}
      </label>
      {description && <div className={styles.fieldDescription}>{description}</div>}
      <div className={styles.selectWrapper}>
        <select id={id} name={id} required={required}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
