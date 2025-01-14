import { IconType } from 'react-icons'
import styles from './SelectField.module.scss'

interface SelectFieldProps {
  id: string
  label: string
  description: React.ReactNode
  Icon: IconType
  options: Array<{
    value: string
    label: string
  }>
  required?: boolean
  defaultValue?: string
  teamPrefix?: string
  className?: string
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  required,
  defaultValue,
  teamPrefix,
  className
}: SelectFieldProps) {
  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label htmlFor={id}>
        {Icon && <Icon />}
        {label}
      </label>
      {description && <div className={styles.fieldDescription}>{description}</div>}
      <div className={styles.selectWrapper}>
        {teamPrefix && <span className={styles.prefix}>{teamPrefix}</span>}
        <select id={id} name={id} required={required} defaultValue={defaultValue}>
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
