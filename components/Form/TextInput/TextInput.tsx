import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
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
      // Create a synthetic event that matches the expected type
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
    <Box>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mb: 0.5,
        }}
      >
        <Icon /> {label}
      </Typography>
      {description && (
        <Typography id={`${id}-description`} color="text.secondary">
          {description}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          fullWidth
          size="small"
          disabled={disabled}
          onChange={handleChange}
          slotProps={{
            htmlInput: {
              "aria-describedby": description ? `${id}-description` : undefined,
            },
          }}
        />
        {suffix}
      </Box>
    </Box>
  )
}
