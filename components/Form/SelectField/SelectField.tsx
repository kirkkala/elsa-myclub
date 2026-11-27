"use client"

import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import type { ElementType } from "react"

interface SelectOption {
  value: string
  label?: string
}

interface SelectFieldProps {
  id: string
  label: string
  description?: string
  Icon: ElementType
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** Allow typing a value that is not in the options list */
  freeSolo?: boolean
  disableClearable?: boolean
}

export default function SelectField({
  id,
  label,
  description,
  Icon,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  freeSolo = false,
  disableClearable = true,
}: SelectFieldProps) {
  // Autocomplete works with option objects; free text stays a plain string
  const selected =
    options.find((option) => option.value === value) ?? (freeSolo && value ? value : null)

  return (
    <Box data-testid="select-wrapper" sx={{ mb: 4 }}>
      <Autocomplete
        id={id}
        options={options}
        value={selected}
        onChange={(_event, newValue) =>
          onChange(typeof newValue === "string" ? newValue : (newValue?.value ?? ""))
        }
        getOptionLabel={(option) =>
          typeof option === "string" ? option : (option.label ?? option.value)
        }
        disabled={disabled}
        fullWidth
        size="small"
        disablePortal
        disableClearable={disableClearable}
        openOnFocus
        freeSolo={freeSolo}
        autoSelect={freeSolo}
        renderInput={(params) => (
          <TextField
            {...params}
            name={id}
            label={label}
            placeholder={placeholder}
            helperText={description}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Icon sx={{ fontSize: "1.25rem" }} />
                    </InputAdornment>
                    {params.slotProps.input.startAdornment}
                  </>
                ),
              },
              htmlInput: {
                ...params.slotProps.htmlInput,
                "aria-label": label,
              },
            }}
          />
        )}
      />
    </Box>
  )
}
