import { RiFileExcel2Line } from "react-icons/ri"
import { LuSend } from "react-icons/lu"
import styles from './FileInput.module.scss'

interface FileInputProps {
  selectedFile: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileInput({ selectedFile, onChange }: FileInputProps) {
  return (
    <div className={styles.formGroup}>
      <label>
        <LuSend /> Valitse tiedosto
      </label>
      <p className={styles.fieldDescription}>
        Valitse tähän kenttään ELSA:sta ladattu excel-tiedosto.
      </p>
      <label htmlFor="file" className={styles.fileupload}>
        <RiFileExcel2Line />
        <span>{selectedFile || 'Valitse tiedosto...'}</span>
        {selectedFile && <span className={styles.fileCheck}>✓</span>}
      </label>
      <input
        type="file"
        name="file"
        id="file"
        accept=".xlsx,.xls"
        required
        onChange={onChange}
      />
    </div>
  )
}
