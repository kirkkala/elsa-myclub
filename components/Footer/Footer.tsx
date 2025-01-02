import { LuHeart } from 'react-icons/lu'
import styles from '../../styles/Main.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Made with <LuHeart style={{ transform: 'translateY(2px)' }} /> by{' '}
        <a
          href="mailto:timo.kirkkala@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >Timo Kirkkala</a>
      </p>
      <p>Source code published on{' '}
        <a
          href="https://github.com/kirkkala/elsa-myclub"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >GitHub</a>
      </p>
    </footer>
  )
}
