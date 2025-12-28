import { ElementType } from "react"

export interface BaseFormFieldProps {
  id: string
  label: string
  description?: string
  Icon: ElementType
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export interface SelectOption {
  value: string
  label?: string
  disabled?: boolean
}
