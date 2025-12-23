"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import InputAdornment from "@mui/material/InputAdornment"
import { BaseFormFieldProps, SelectOption } from "../types"

interface SelectFieldProps extends BaseFormFieldProps {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  placeholder?: string
  freeSolo?: boolean
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
  placeholder,
  onChange,
  disabled,
  freeSolo = false,
}: SelectFieldProps) {
  const findOption = (val: string) => options.find((opt) => opt.value === val) ?? null

  // With freeSolo, value can be string (custom input) or SelectOption (from list)
  const [selectedValue, setSelectedValue] = useState<SelectOption | string | null>(() => {
    const initial = value ?? defaultValue ?? ""
    if (!initial) {
      return null
    }
    return findOption(initial) ?? (freeSolo ? initial : null)
  })

  useEffect(() => {
    if (value !== undefined) {
      const found = options.find((opt) => opt.value === value)
      setSelectedValue(found || (freeSolo && value) || null)
    }
  }, [value, options, freeSolo])

  const handleChange = (_event: React.SyntheticEvent, newValue: SelectOption | string | null) => {
    setSelectedValue(newValue)
    if (onChange) {
      // Extract the string value whether it's an option or custom text
      const stringValue = typeof newValue === "string" ? newValue : (newValue?.value ?? "")
      const syntheticEvent = {
        target: {
          name: id,
          value: stringValue,
        },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  // Handle both string (custom input) and SelectOption (from list)
  const getOptionLabel = (option: SelectOption | string) => {
    if (typeof option === "string") {
      return option
    }
    return option.label ?? option.value
  }

  const isOptionEqualToValue = (option: SelectOption, val: SelectOption | string) => {
    if (typeof val === "string") {
      return option.value === val
    }
    return option.value === val.value
  }

  return (
    <Box data-testid="select-wrapper" sx={{ mb: 4 }}>
      <Autocomplete
        id={id}
        options={options}
        value={selectedValue}
        onChange={handleChange}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionDisabled={(option) => option.disabled ?? false}
        disabled={disabled}
        fullWidth
        size="small"
        disablePortal
        openOnFocus
        freeSolo={freeSolo}
        autoSelect={freeSolo}
        renderInput={(params) => (
          <TextField
            {...params}
            name={id}
            label={label}
            placeholder={placeholder}
            required={required}
            helperText={description}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Icon sx={{ fontSize: "1.25rem" }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              },
              formHelperText: {
                id: description ? `${id}-description` : undefined,
              },
              htmlInput: {
                ...params.inputProps,
                "aria-label": label,
              },
            }}
          />
        )}
      />
    </Box>
  )
}
