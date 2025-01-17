import { ProcessedRow } from "../../pages/api/upload"
import styles from "./Preview.module.css"

interface PreviewProps {
  data: ProcessedRow[]
}

export default function Preview({ data }: PreviewProps): React.ReactNode | null {
  if (!data.length) {
    return null
  }

  const getRowKey = (row: ProcessedRow): string => {
    // Combine multiple fields to create a unique key
    return `${row.Nimi}-${row.Tapahtumapaikka}-${row.Alkaa}`
  }

  return (
    <div className={styles.container}>
      <h3>Esikatselu</h3>
      <p>Esikatselu eLSA:n excel-tiedostosta konvertoituna MyClub-tuontitiedostoksi.</p>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Kuvaus</th>
              <th>Ryhmä</th>
              <th>Tapahtumatyyppi</th>
              <th>Tapahtumapaikka</th>
              <th>Alkaa</th>
              <th>Päättyy</th>
              <th>Ilmoittautuminen</th>
              <th>Näkyvyys</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getRowKey(row)}>
                <td>{row.Nimi}</td>
                <td>{row.Kuvaus}</td>
                <td>{row.Ryhmä}</td>
                <td>{row.Tapahtumatyyppi}</td>
                <td>{row.Tapahtumapaikka}</td>
                <td>{row.Alkaa}</td>
                <td>{row.Päättyy}</td>
                <td>{row.Ilmoittautuminen}</td>
                <td>{row.Näkyvyys}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
