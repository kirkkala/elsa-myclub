import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"

import { NOTIFICATION } from "../../config"

// Maps the config severity to a MUI Alert severity.
const SEVERITY_MAP = {
  alert: "error",
  warning: "warning",
} as const

export default function Notification() {
  if (!NOTIFICATION.enabled || !NOTIFICATION.message) {
    return null
  }

  return (
    <Box sx={{ maxWidth: 780, mx: "auto", width: "100%", px: 3, pt: 2 }}>
      <Alert severity={SEVERITY_MAP[NOTIFICATION.severity]}>
        {/* Message is admin-controlled config, so rendering HTML is safe. */}
        <span dangerouslySetInnerHTML={{ __html: NOTIFICATION.message }} />
      </Alert>
    </Box>
  )
}
