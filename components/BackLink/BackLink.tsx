"use client"

import Link from "next/link"
import Button from "@mui/material/Button"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export default function BackLink() {
  return (
    <Button
      component={Link}
      href="/"
      startIcon={<ArrowBackIcon />}
      sx={{
        mb: 2,
        color: "text.secondary",
        "&:hover": {
          color: "primary.main",
          bgcolor: "transparent",
        },
      }}
    >
      Etusivulle
    </Button>
  )
}
