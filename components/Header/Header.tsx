import Image from "next/image"
import Link from "next/link"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { LuWandSparkles } from "react-icons/lu"
import { SITE_CONFIG } from "../../config"

export default function Header() {
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
          alt="eLSA"
          width={65}
          height={40}
          style={{ objectFit: "contain", backgroundColor: "#004176", padding: 8, borderRadius: 6 }}
        />
        <LuWandSparkles
          style={{
            fontSize: "1rem",
            color: "#6b7280",
          }}
        />
        <Image
          src="/images/myclub.svg"
          alt="MyClub"
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
            size="small"
            clickable
            sx={{
              fontSize: "0.75rem",
              height: 22,
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
    </Box>
  )
}
