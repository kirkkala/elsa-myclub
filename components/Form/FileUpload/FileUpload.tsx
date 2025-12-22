"use client"

import { useRef } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { RiFileExcel2Line } from "react-icons/ri"
import { LuSend, LuCheck } from "react-icons/lu"

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
    <Box>
      <Typography
        component="label"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        <LuSend /> {label}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
      <Button
        variant="outlined"
        onClick={handleButtonClick}
        fullWidth
        sx={{
          py: 2,
          justifyContent: "flex-start",
          gap: 1,
          borderStyle: "dashed",
          color: selectedFile ? "success.main" : "text.secondary",
          borderColor: selectedFile ? "success.main" : "divider",
          bgcolor: selectedFile ? "success.light" : "transparent",
          "&:hover": {
            borderStyle: "dashed",
            bgcolor: selectedFile ? "success.light" : "action.hover",
          },
        }}
      >
        <RiFileExcel2Line style={{ fontSize: "1.25rem" }} />
        <Typography
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
        >
          {selectedFile || "Valitse tiedosto..."}
        </Typography>
        {selectedFile && <LuCheck style={{ marginLeft: "auto", color: "#16a34a" }} />}
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
      />
    </Box>
  )
}
