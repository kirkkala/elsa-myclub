import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"
import styles from "./BackLink.module.scss"

export default function BackLink() {
  return (
    <Link href="/" className={styles.backLink}>
      <LuArrowLeft /> Etusivulle
    </Link>
  )
}
