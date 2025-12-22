import Box from "@mui/material/Box"
import MuiButton from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { IconType } from "react-icons"

interface ButtonProps {
  type?: "button" | "submit"
  disabled?: boolean
  Icon?: IconType
  label?: string
  description?: string
  children: React.ReactNode
}

export default function Button({
  children,
  type,
  disabled,
  Icon,
  label,
  description,
}: ButtonProps) {
  return (
    <Box>
      {label && (
        <Typography
          component="label"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 0.5,
          }}
        >
          {Icon && <Icon />}
          {label}
        </Typography>
      )}
      {description && (
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}
      <MuiButton
        type={type}
        disabled={disabled}
        variant="contained"
        size="large"
        fullWidth
        sx={{
          py: 1.5,
          fontSize: "1rem",
        }}
      >
        {children}
      </MuiButton>
    </Box>
  )
}
