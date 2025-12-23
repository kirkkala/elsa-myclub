import Container from "@mui/material/Container"
import Box from "@mui/material/Box"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 600,
          py: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
