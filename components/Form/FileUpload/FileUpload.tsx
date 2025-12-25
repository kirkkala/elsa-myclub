"use client"

import CheckIcon from "@mui/icons-material/Check"
import DescriptionIcon from "@mui/icons-material/Description"
import SendIcon from "@mui/icons-material/Send"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import { useRef } from "react"

interface FileUploadProps {
  label: string
  description: string
  selectedFile: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload({
  selectedFile,
  onChange,
  label,
  description,
}: FileUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <FormControl fullWidth>
      <FormLabel
        htmlFor="file"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: 600,
          mb: 0.5,
          color: "text.primary",
        }}
      >
        <SendIcon sx={{ fontSize: "1rem" }} /> {label}
      </FormLabel>
      <FormHelperText sx={{ mx: 0, mb: 1 }}>{description}</FormHelperText>
      <Button
        variant="outlined"
        onClick={handleButtonClick}
        fullWidth
        aria-describedby="file-description"
        sx={{
          py: 2,
          mb: 2,
          justifyContent: "flex-start",
          gap: 1,
          borderStyle: "dashed",
          color: selectedFile ? "success.main" : "text.secondary",
          borderColor: selectedFile ? "success.main" : "divider",
          bgcolor: selectedFile ? "transparent" : "transparent",
        }}
      >
        <DescriptionIcon sx={{ fontSize: "1.25rem" }} />
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
        >
          {selectedFile || "Valitse tiedosto..."}
        </Box>
        {selectedFile && <CheckIcon sx={{ marginLeft: "auto" }} />}
      </Button>
      <input
        ref={inputRef}
        type="file"
        data-testid="file-input"
        name="file"
        id="file"
        accept=".xlsx,.xls"
        required
        onChange={onChange}
        style={{ display: "none" }}
        aria-label={label}
      />
    </FormControl>
  )
}
