import styles from "./SelectField.module.scss"
import { BaseFormFieldProps, SelectOption } from "../types"

interface SelectFieldProps extends BaseFormFieldProps {
  options: SelectOption[]
  defaultValue?: string
  suffix?: React.ReactNode
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
  suffix,
  className,
  onChange,
  disabled,
}: SelectFieldProps): React.ReactElement {
  const optionElements = options.map((option) => (
    <option key={`${option.value}`} value={option.value} disabled={option.disabled}>
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
          disabled={disabled}
        >
          {optionElements}
        </select>
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
    </div>
  )
}
