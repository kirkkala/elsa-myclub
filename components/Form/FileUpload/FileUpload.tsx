import { RiFileExcel2Line } from "react-icons/ri"
import { LuSend } from "react-icons/lu"
import styles from "./FileUpload.module.scss"

interface FileUploadProps {
  label: string
  description: string
  selectedFile: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload({ selectedFile, onChange, label, description }: FileUploadProps): React.ReactElement {
  return (
    <div className={styles.formGroup}>
      <label>
        <LuSend /> {label}
      </label>
      <p className={styles.fieldDescription}>{description}</p>
      <label htmlFor="file" className={styles.fileupload}>
        <RiFileExcel2Line />
        <span>{selectedFile || "Valitse tiedosto..."}</span>
        {selectedFile && <span className={styles.fileCheck}>✓</span>}
      </label>
      <input
        type="file"
        data-testid="file-input" // @todo: check if we need separate test-ID's for this component
        name="file"
        id="file"
        accept=".xlsx,.xls"
        required
        onChange={onChange}
        className={styles.hiddenInput}
      />
    </div>
  )
}
