"use client"

import { useEffect, useState, useCallback } from "react"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface InfoProps {
  title: string
  expandable?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  id?: string
}

// Helper function to generate URL-safe ID from title
const generateId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Helper function to get open sections from URL hash
const getOpenSections = (): string[] => {
  if (typeof window === "undefined") {
    return []
  }
  const hash = window.location.hash.substring(1)
  return hash ? hash.split(",").filter(Boolean) : []
}

// Helper function to update URL hash with open sections
const updateUrlHash = (openSections: string[]): void => {
  if (typeof window === "undefined") {
    return
  }

  if (openSections.length > 0) {
    window.history.replaceState(null, "", `#${openSections.join(",")}`)
  } else {
    const url = window.location.pathname + window.location.search
    window.history.replaceState(null, "", url)
  }
}

export default function Info({
  title,
  expandable = true,
  defaultOpen = false,
  children,
  id,
}: InfoProps) {
  const sectionId = id || generateId(title)
  const [expanded, setExpanded] = useState(defaultOpen)

  // Check URL hash on mount and open if matches
  useEffect(() => {
    const openSections = getOpenSections()
    if (openSections.includes(sectionId)) {
      setExpanded(true)
    }
  }, [sectionId])

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded)

      // Update URL hash after the toggle
      const openSections = getOpenSections()

      if (isExpanded) {
        if (!openSections.includes(sectionId)) {
          openSections.push(sectionId)
        }
      } else {
        const index = openSections.indexOf(sectionId)
        if (index > -1) {
          openSections.splice(index, 1)
        }
      }

      updateUrlHash(openSections)
    },
    [sectionId]
  )

  if (expandable) {
    return (
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        id={sectionId}
        slotProps={{ heading: { component: "h2" } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        mb: 2,
        p: 2,
      }}
    >
      <Typography variant="h2">{title}</Typography>
      {children}
    </Box>
  )
}
