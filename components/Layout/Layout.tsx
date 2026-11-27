import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import Notification from "../Notification/Notification"

// Site chrome shared by every page; rendered once from the root layout.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Notification />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 780,
            py: 3,
          }}
        >
          {children}
          <Footer />
        </Container>
      </Box>
    </>
  )
}
