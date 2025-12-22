import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import MuiLink from "@mui/material/Link"
import { LuHeart } from "react-icons/lu"
import { SITE_CONFIG } from "../../config"

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        pt: 3,
        borderTop: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">
        Made with{" "}
        <LuHeart
          style={{
            transform: "translateY(2px)",
            color: "#c8102e",
          }}
        />{" "}
        by{" "}
        <MuiLink href={SITE_CONFIG.links.githubAuthorUrl} target="_blank" rel="noopener noreferrer">
          {SITE_CONFIG.author.name}
        </MuiLink>
      </Typography>
      <Typography color="text.secondary">
        Source code published on{" "}
        <MuiLink
          href={SITE_CONFIG.links.githubAppRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </MuiLink>
      </Typography>
    </Box>
  )
}
