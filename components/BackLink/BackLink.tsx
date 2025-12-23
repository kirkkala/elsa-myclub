"use client"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Link from "next/link"

export default function BackLink() {
  return (
    <Box
      sx={{
        m: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
            bgcolor: "transparent",
          },
        }}
      >
        Etusivulle
      </Button>
    </Box>
  )
}
