"use client"

import { alpha, createTheme } from "@mui/material/styles"

// Brand colors
const hnmkyRed = "#ff4238"

// Grays
const darkGray = "#1f2937"
const mediumGray = "#374151"
const gray = "#6b7280"
const lightGray = "#e5e7eb"
const paleGray = "#f9fafb"
const white = "#ffffff"

// Semantic colors
const errorRed = "#dc2626"
const errorRedLight = "#f4bdbd"
const successGreen = "#16a34a"
const successGreenLight = "#a1dab6"

const theme = createTheme({
  palette: {
    primary: {
      main: hnmkyRed,
    },
    secondary: {
      main: darkGray,
    },
    error: {
      main: errorRed,
      light: errorRedLight,
    },
    success: {
      main: successGreen,
      light: successGreenLight,
    },
    text: {
      primary: darkGray,
      secondary: gray,
    },
    background: {
      default: white,
      paper: paleGray,
    },
    divider: lightGray,
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12.8,
    h1: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.4em",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1rem",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowX: "hidden",
        },
        body: {
          overflowX: "scroll",
        },
        a: {
          color: hnmkyRed,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          },
        },
        ul: {
          paddingLeft: "1.25rem",
          marginLeft: 0,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        sx: { marginBottom: "1.25rem" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          margin: "0",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover": {
            backgroundColor: alpha(theme.palette.divider, 0.4),
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "0.2rem 0.75rem",
          borderColor: lightGray,
          whiteSpace: "nowrap",
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "0.8rem",
        },
        head: {
          backgroundColor: paleGray,
          fontWeight: 700,
          color: mediumGray,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: hnmkyRed,
          fontWeight: 500,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          },
        },
      },
    },
  },
})

export default theme
