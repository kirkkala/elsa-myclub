import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import type { MyClubExcelRow } from "@/utils/excel"
import PreviewIcon from "@mui/icons-material/RemoveRedEyeSharp"

interface PreviewProps {
  data: MyClubExcelRow[]
}

export default function Preview({ data }: PreviewProps) {
  if (!data.length) {
    return null
  }

  const getRowKey = (row: MyClubExcelRow): string => {
    const id = `${row.Alkaa}-${row.Päättyy}`.replace(/\W/g, "_")
    return id
  }

  return (
    <Box
      sx={{
        mt: 3,
        // Break out of container to full width
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        px: { xs: 1, sm: 2 },
      }}
    >
      <Typography variant="h2" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <PreviewIcon /> Esikatselu ({data.length} tapahtumaa)
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nimi</TableCell>
              <TableCell>Alkaa</TableCell>
              <TableCell>Päättyy</TableCell>
              <TableCell>Kuvaus</TableCell>
              <TableCell>Ryhmä</TableCell>
              <TableCell>Tapahtumatyyppi</TableCell>
              <TableCell>Tapahtumapaikka</TableCell>
              <TableCell>Ilmoittautuminen</TableCell>
              <TableCell>Näkyvyys</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={getRowKey(row)} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.Nimi}</TableCell>
                <TableCell>{row.Alkaa}</TableCell>
                <TableCell>{row.Päättyy}</TableCell>
                <TableCell>{row.Kuvaus}</TableCell>
                <TableCell>{row.Ryhmä}</TableCell>
                <TableCell>{row.Tapahtumatyyppi}</TableCell>
                <TableCell>{row.Tapahtumapaikka}</TableCell>
                <TableCell>{row.Ilmoittautuminen}</TableCell>
                <TableCell>{row.Näkyvyys}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
