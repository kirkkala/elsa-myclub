import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import { BaseFormFieldProps } from "../types"

interface TextInputProps extends BaseFormFieldProps {
  placeholder?: string
  defaultValue?: string
  suffix?: React.ReactNode
}

export default function TextInput({
  id,
  label,
  description,
  Icon,
  placeholder,
  defaultValue,
  required = false,
  suffix,
  onChange,
  disabled,
}: TextInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: id,
          value: event.target.value,
        },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          id={id}
          name={id}
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          fullWidth
          size="small"
          disabled={disabled}
          onChange={handleChange}
          helperText={description}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon sx={{ fontSize: "1.25rem" }} />
                </InputAdornment>
              ),
            },
            formHelperText: {
              id: description ? `${id}-description` : undefined,
            },
          }}
        />
        {suffix}
      </Box>
    </Box>
  )
}
