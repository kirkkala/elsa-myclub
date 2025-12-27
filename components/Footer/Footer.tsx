import FavoriteIcon from "@mui/icons-material/Favorite"
import Box from "@mui/material/Box"
import MuiLink from "@mui/material/Link"
import Typography from "@mui/material/Typography"

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
        color: "text.secondary",
      }}
    >
      <Typography sx={{ mb: 0.5 }}>
        Made with{" "}
        <FavoriteIcon
          sx={{
            fontSize: "1rem",
            transform: "translateY(2px)",
            color: "primary.main",
          }}
        />{" "}
        by{" "}
        <MuiLink href={SITE_CONFIG.links.githubAuthorUrl} target="_blank" rel="noopener noreferrer">
          {SITE_CONFIG.author.name}
        </MuiLink>
      </Typography>
      <Typography>
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
