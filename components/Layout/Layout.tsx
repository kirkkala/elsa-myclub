import styles from "./Layout.module.scss"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return <main className={styles.container}>{children}</main>
}
