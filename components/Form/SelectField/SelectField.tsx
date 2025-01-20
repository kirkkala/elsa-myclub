import { IconType } from "react-icons"
import styles from "./SelectField.module.scss"

interface SelectFieldProps {
  id: string
  label: string
  description?: string
  Icon: IconType
  options: Array<{
    value: string
    label?: string
  }>
  required?: boolean
  defaultValue?: string
  suffix?: React.ReactNode
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  required,
  defaultValue,
  suffix,
  className,
  onChange,
}: SelectFieldProps): React.ReactElement {
  const optionElements = options.map((option) => (
    <option key={`${option.value}`} value={option.value}>
      {option.label ?? option.value}
    </option>
  ))

  return (
    <div
      className={styles.formGroup + (className ? ` ${className}` : "")}
      data-testid="select-wrapper"
    >
      <label htmlFor={id}>
        <Icon />
        {label}
      </label>
      {description && (
        <div id={`${id}-description`} className={styles.fieldDescription}>
          {description}
        </div>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={id}
          name={id}
          required={required}
          defaultValue={defaultValue}
          aria-describedby={description ? `${id}-description` : undefined}
          onChange={onChange}
        >
          {optionElements}
        </select>
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
    </div>
  )
}
