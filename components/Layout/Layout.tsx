import styles from './Layout.module.scss'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
