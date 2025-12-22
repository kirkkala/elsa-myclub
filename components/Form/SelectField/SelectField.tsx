"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import { BaseFormFieldProps, SelectOption } from "../types"

interface SelectFieldProps extends BaseFormFieldProps {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  suffix?: React.ReactNode
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  required,
  defaultValue,
  value,
  suffix,
  onChange,
  disabled,
}: SelectFieldProps) {
  // Use internal state to track the selected value for controlled behavior
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "")

  // Sync with external value prop when it changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleChange = (event: SelectChangeEvent) => {
    setInternalValue(event.target.value)
    if (onChange) {
      // Create a synthetic event that matches the expected type
      const syntheticEvent = {
        target: {
          name: id,
          value: event.target.value,
        },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  return (
    <Box data-testid="select-wrapper">
      <Typography
        component="label"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mb: 0.5,
        }}
      >
        <Icon />
        {label}
      </Typography>
      {description && (
        <Typography id={`${id}-description`} color="text.secondary">
          {description}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControl fullWidth size="small" disabled={disabled}>
          <Select
            id={id}
            name={id}
            value={internalValue}
            onChange={handleChange}
            required={required}
            displayEmpty
            aria-describedby={description ? `${id}-description` : undefined}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label ?? option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {suffix}
      </Box>
    </Box>
  )
}
