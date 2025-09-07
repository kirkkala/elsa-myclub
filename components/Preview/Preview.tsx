import type { MyClubExcelRow } from "@/utils/excel"
import styles from "./Preview.module.scss"

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
    <div className={styles.preview}>
      <div className={styles.previewTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nimi</th>
              <th>Alkaa</th>
              <th>Päättyy</th>
              <th>Kuvaus</th>
              <th>Ryhmä</th>
              <th>Tapahtumatyyppi</th>
              <th>Tapahtumapaikka</th>
              <th>Ilmoittautuminen</th>
              <th>Näkyvyys</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={getRowKey(row)}>
                <td>{index + 1}</td>
                <td>{row.Nimi}</td>
                <td>{row.Alkaa}</td>
                <td>{row.Päättyy}</td>
                <td>{row.Kuvaus}</td>
                <td>{row.Ryhmä}</td>
                <td>{row.Tapahtumatyyppi}</td>
                <td>{row.Tapahtumapaikka}</td>
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
