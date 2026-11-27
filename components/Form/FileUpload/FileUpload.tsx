"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { type FileRejection, useDropzone } from "react-dropzone"

interface FileUploadProps {
  label?: string
  description?: string
  files: File[]
  onFilesChange: (files: File[]) => void
  /** Name of a file that failed to convert; its chip is shown in red */
  errorFileName?: string
  disabled?: boolean
}

export default function FileUpload({
  files,
  onFilesChange,
  label,
  description,
  errorFileName,
  disabled = false,
}: FileUploadProps): React.ReactElement {
  // Tells the user why some of the files they picked were left out
  const [skippedNotices, setSkippedNotices] = useState<string[]>([])

  const onDrop = (acceptedFiles: File[], rejections: FileRejection[]) => {
    const existingNames = new Set(files.map((f) => f.name))
    const newFiles = acceptedFiles.filter((f) => !existingNames.has(f.name))
    const duplicates = acceptedFiles.filter((f) => existingNames.has(f.name))

    const notices: string[] = []
    if (rejections.length > 0) {
      const names = rejections.map((rejection) => rejection.file.name).join(", ")
      notices.push(`Vain Excel-tiedostot (.xlsx, .xls) kelpaavat, ei lisätty: ${names}`)
    }
    if (duplicates.length > 0) {
      const names = duplicates.map((f) => f.name).join(", ")
      notices.push(`Samanniminen tiedosto on jo lisätty: ${names}`)
    }
    setSkippedNotices(notices)

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles])
    }
  }

  const removeFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSkippedNotices([])
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
        <input {...getInputProps({ id: "file" })} data-testid="file-input" aria-label={label} />

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
            mb: 0,
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
                color={file.name === errorFileName ? "error" : "success"}
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
            Tuetut tiedostomuodot: .xlsx, .xls
          </Typography>
        )}
      </Box>

      {skippedNotices.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {skippedNotices.map((notice) => (
            <Box key={notice}>{notice}</Box>
          ))}
        </Alert>
      )}
    </FormControl>
  )
}
