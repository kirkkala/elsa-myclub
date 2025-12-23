"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import MagicIcon from "@mui/icons-material/AutoAwesomeTwoTone"
import { SITE_CONFIG } from "../../config"

export default function Header() {
  const pathname = usePathname()
  const isDocsPage = pathname === "/docs"
  const linkText = "Lisätietoja ja ohjeet"
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
        }}
      >
        <Image
          src="/images/elsa.png"
          alt=""
          width={65}
          height={40}
          style={{ objectFit: "contain", backgroundColor: "#004176", padding: 8, borderRadius: 6 }}
        />
        <MagicIcon
          sx={{
            mx: 1,
            fontSize: "2rem",
            color: "#6b7280",
          }}
        />
        <Image
          src="/images/myclub.svg"
          alt=""
          width={50}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h1">{SITE_CONFIG.name}</Typography>
        <Link href="/changelog">
          <Chip
            label={SITE_CONFIG.version}
            clickable
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
                borderColor: "primary.main",
              },
            }}
          />
        </Link>
      </Box>
      <Box component="nav" sx={{ mt: 1 }}>
        {isDocsPage ? (
          <Typography component="span">{linkText}</Typography>
        ) : (
          <Link href="/docs">{linkText}</Link>
        )}
      </Box>
    </Box>
  )
}
