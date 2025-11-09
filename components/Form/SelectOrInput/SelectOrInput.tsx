"use client"

import { useState } from "react"
import { LuPencil, LuList } from "react-icons/lu"
import SelectField from "../SelectField/SelectField"
import TextInput from "../TextInput/TextInput"
import styles from "./SelectOrInput.module.scss"
import { BaseFormFieldProps, SelectOption } from "../types"

interface SwitchText {
  toInput: { action: string }
  toList: { action: string }
}

interface SelectOrInputProps extends BaseFormFieldProps {
  options: SelectOption[]
  placeholder?: string
  switchText: SwitchText
}

const SwitchLink = ({
  isInput,
  disabled,
  switchText,
  onToggle,
}: {
  isInput: boolean
  disabled: boolean
  switchText: SwitchText
  onToggle: () => void
}) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault()
      if (!disabled) {
        onToggle()
      }
    }}
    className={disabled ? styles.disabled : ""}
  >
    {isInput ? <LuList /> : <LuPencil />}{" "}
    {isInput ? switchText.toList.action : switchText.toInput.action}
  </a>
)

export default function SelectOrInput({
  options,
  disabled,
  switchText,
  ...props
}: SelectOrInputProps) {
  const [useCustomInput, setUseCustomInput] = useState(false)

  const displayOptions = [
    { value: "", label: "Valitse joukkue" },
    ...options.map((option) => ({
      value: option.value,
      label: option.value,
    })),
  ]

  const switchLink = (
    <SwitchLink
      isInput={useCustomInput}
      disabled={disabled ?? false}
      switchText={switchText}
      onToggle={() => setUseCustomInput(!useCustomInput)}
    />
  )

  return (
    <div className={styles.selectOrInput}>
      {!useCustomInput ? (
        <SelectField
          {...props}
          className={styles.nestedField}
          options={displayOptions}
          suffix={switchLink}
          disabled={disabled}
        />
      ) : (
        <TextInput
          {...props}
          placeholder={props.placeholder}
          suffix={switchLink}
          disabled={disabled}
        />
      )}
    </div>
  )
}
