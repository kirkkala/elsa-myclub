import { IconType } from "react-icons"

export interface BaseFormFieldProps {
  id: string
  label: string
  description?: string
  Icon: IconType
  required?: boolean
  disabled?: boolean
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export interface SelectOption {
  value: string
  label?: string
  disabled?: boolean
}
