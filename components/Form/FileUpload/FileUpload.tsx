"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import SendIcon from "@mui/icons-material/Send"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import Typography from "@mui/material/Typography"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploadProps {
  label: string
  description?: string
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
}

export default function FileUpload({
  files,
  onFilesChange,
  label,
  description,
  disabled = false,
}: FileUploadProps): React.ReactElement {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const existingNames = new Set(files.map((f) => f.name))
      const newFiles = acceptedFiles.filter((f) => !existingNames.has(f.name))
      onFilesChange([...files, ...newFiles])
    },
    [files, onFilesChange]
  )

  const removeFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onFilesChange(files.filter((f) => f.name !== fileName))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    disabled,
    multiple: true,
  })

  const hasFiles = files.length > 0

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

      <Box
        {...getRootProps()}
        data-testid="dropzone"
        sx={{
          py: 3,
          px: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          border: "2px dashed",
          borderRadius: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          borderColor: isDragActive ? "primary.main" : hasFiles ? "success.main" : "divider",
          bgcolor: isDragActive ? "action.hover" : "transparent",
          opacity: disabled ? 0.5 : 1,
          "&:hover": disabled
            ? {}
            : {
                bgcolor: "action.hover",
              },
        }}
      >
        <input {...getInputProps()} data-testid="file-input" aria-label={label} />

        {hasFiles ? (
          <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
        ) : (
          <CloudUploadIcon
            sx={{ fontSize: 40, color: isDragActive ? "primary.main" : "text.secondary" }}
          />
        )}

        <Typography
          variant="body1"
          sx={{
            color: isDragActive ? "primary.main" : hasFiles ? "success.main" : "text.secondary",
            textAlign: "center",
          }}
        >
          {isDragActive
            ? "Pudota tiedostot tähän..."
            : hasFiles
              ? `${String(files.length)} tiedosto${files.length > 1 ? "a" : ""} lisätty`
              : "Pudota eLSA:sta haetut excel-tiedostot tai klikkaa valitaksesi"}
        </Typography>

        {hasFiles ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {files.map((file) => (
              <Chip
                key={file.name}
                label={file.name}
                size="small"
                color="success"
                onDelete={
                  disabled
                    ? undefined
                    : (e) => {
                        removeFile(file.name, e as React.MouseEvent)
                      }
                }
                deleteIcon={<CloseIcon fontSize="small" />}
                aria-label={`Poista ${file.name}`}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Tuetut tiedostomuodot: .xlsx
          </Typography>
        )}
      </Box>
    </FormControl>
  )
}
