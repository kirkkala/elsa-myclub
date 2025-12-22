"use client"

import { useRouter } from "next/navigation"
import MuiLink from "@mui/material/Link"

interface InternalLinkProps {
  href: string
  children: React.ReactNode
}

export default function InternalLink({ href, children }: InternalLinkProps) {
  const router = useRouter()

  return (
    <MuiLink
      component="button"
      onClick={() => router.push(href)}
      sx={{
        cursor: "pointer",
        verticalAlign: "baseline",
        fontSize: "inherit",
        fontWeight: "inherit",
      }}
    >
      {children}
    </MuiLink>
  )
}
