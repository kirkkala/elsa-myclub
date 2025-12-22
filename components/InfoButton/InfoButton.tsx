"use client"

import { useRouter } from "next/navigation"
import Button from "@mui/material/Button"
import InfoIcon from "@mui/icons-material/Info"

export default function InfoButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/docs")}
      variant="outlined"
      startIcon={<InfoIcon />}
      sx={{
        py: 1,
        px: 2,
      }}
    >
      Käyttöohjeet ja tietoja sovelluksesta
    </Button>
  )
}
