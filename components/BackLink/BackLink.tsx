import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"
import styles from "./BackLink.module.scss"

export default function BackLink(): React.ReactElement {
  return (
    <Link href="/" className={styles.backLink}>
      <LuArrowLeft /> Takaisin
    </Link>
  )
}
