"use client"

import MagicIcon from "@mui/icons-material/AutoAwesomeTwoTone"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { PAGES, SITE_CONFIG } from "../../config"

const CHANGELOG_PATH = "/changelog"

export default function Header() {
  const pathname = usePathname()
  const isChangelogPage = pathname === CHANGELOG_PATH
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
        <Typography variant="h1" sx={{ m: 0.5 }}>
          {SITE_CONFIG.name}
        </Typography>
        {isChangelogPage ? (
          <Chip
            label={SITE_CONFIG.version}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              border: 1,
              borderColor: "primary.main",
              fontWeight: 700,
            }}
          />
        ) : (
          <Link href={CHANGELOG_PATH}>
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
        )}
      </Box>
      <Tabs value={pathname} component="nav" sx={{ mt: 1, mb: 2 }}>
        {PAGES.map((page) => (
          <Tab
            key={page.path}
            label={page.label}
            value={page.path}
            href={page.path}
            component={Link}
            sx={{
              textTransform: "none",
              textDecoration: "none",
              fontWeight: pathname === page.path ? 700 : 400,
              minWidth: "auto",
              px: 2,
              "&:hover": {
                textDecoration: "none",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  )
}
