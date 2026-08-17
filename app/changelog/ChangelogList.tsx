"use client"

import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiLink from "@mui/material/Link"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { useState } from "react"

import { SITE_CONFIG } from "../../config"
import type { ChangelogEntry } from "./parseChangelog"

export default function ChangelogList({ entries }: { entries: ChangelogEntry[] }) {
  const [hideSystem, setHideSystem] = useState(true)
  const systemCount = entries.filter((entry) => entry.system).length

  // The newest entry (index 0) is always shown so the page never looks empty and
  // stays in sync with the version chip in the header, even if it is maintenance-only.
  const visible = entries.filter((entry, index) => index === 0 || !hideSystem || !entry.system)

  return (
    <Box component="section">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 2,
          rowGap: 1,
          mb: 3,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ m: 0 }}>
          Versiohistoria
        </Typography>
        {systemCount > 0 && (
          <FormControlLabel
            control={
              <Switch
                checked={hideSystem}
                onChange={(event) => setHideSystem(event.target.checked)}
                size="small"
              />
            }
            label="Piilota tekniset päivitykset"
            sx={{
              m: 0,
              color: "text.secondary",
              "& .MuiFormControlLabel-label": {
                mb: 0,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              },
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {visible.map((entry) => {
          const isLatest = entries[0]?.version === entry.version
          const muted = entry.system && !isLatest
          return (
            <Box
              key={entry.version}
              component="article"
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: 2,
                border: 1,
                borderColor: isLatest ? "primary.main" : "divider",
                bgcolor: "background.paper",
                opacity: muted ? 0.75 : 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: "1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <MuiLink
                    href={`${SITE_CONFIG.links.githubAppRepoUrl}/releases/tag/${entry.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {`v${entry.version}`}
                  </MuiLink>
                </Typography>
                {entry.date && (
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ m: 0, color: "text.secondary" }}
                  >
                    {entry.date}
                  </Typography>
                )}
                {isLatest && (
                  <Chip
                    label="uusin"
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                  />
                )}
                {entry.system && (
                  <Chip
                    icon={<BuildOutlinedIcon sx={{ fontSize: "0.85rem" }} />}
                    label="ylläpito"
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      "& .MuiChip-icon": { ml: 0.5 },
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  color: "text.primary",
                  "& ul": { m: 0, pl: 2.5, listStyle: "disc" },
                  "& li": { mb: 0.5, "&:last-child": { mb: 0 } },
                  "& p": { m: 0 },
                }}
                dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
