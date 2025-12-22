"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import MuiLink from "@mui/material/Link"
import { LuPencil, LuList } from "react-icons/lu"
import SelectField from "../SelectField/SelectField"
import TextInput from "../TextInput/TextInput"
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
  <MuiLink
    component="button"
    type="button"
    onClick={(e: React.MouseEvent) => {
      e.preventDefault()
      if (!disabled) {
        onToggle()
      }
    }}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      fontSize: "0.875rem",
      whiteSpace: "nowrap",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    {isInput ? <LuList /> : <LuPencil />}{" "}
    {isInput ? switchText.toList.action : switchText.toInput.action}
  </MuiLink>
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
    <Box>
      {!useCustomInput ? (
        <SelectField {...props} options={displayOptions} suffix={switchLink} disabled={disabled} />
      ) : (
        <TextInput
          {...props}
          placeholder={props.placeholder}
          suffix={switchLink}
          disabled={disabled}
        />
      )}
    </Box>
  )
}
