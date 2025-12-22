"use client"

import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4238",
      dark: "#c8102e",
    },
    secondary: {
      main: "#1f2937",
    },
    error: {
      main: "#dc2626",
      light: "#fee2e2",
    },
    success: {
      main: "#16a34a",
      light: "#dcfce7",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
    background: {
      default: "#ffffff",
      paper: "#f9fafb",
    },
    divider: "#e5e7eb",
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.2em",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.1rem",
      fontWeight: 600,
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
          overflowX: "hidden",
        },
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "0.2rem 0.75rem",
          borderColor: "#e5e7eb",
          whiteSpace: "nowrap",
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "0.8rem",
        },
        head: {
          backgroundColor: "#f9fafb",
          fontWeight: 700,
          color: "#374151",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: "#c8102e",
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
