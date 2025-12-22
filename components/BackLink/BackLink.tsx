"use client"

import Link from "next/link"
import Button from "@mui/material/Button"
import { LuArrowLeft } from "react-icons/lu"

export default function BackLink() {
  return (
    <Button
      component={Link}
      href="/"
      startIcon={<LuArrowLeft />}
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
