import { LuHeart } from 'react-icons/lu'
import styles from './Footer.module.scss'
import { SITE_CONFIG } from '../../config'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Made with <LuHeart style={{ transform: 'translateY(2px)' }} /> by{' '}
        <a
          href={SITE_CONFIG.links.githubAuthorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >{SITE_CONFIG.author.name}</a>
      </p>
      <p>Source code published on{' '}
        <a
          href={SITE_CONFIG.links.githubAppRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
      </p>
    </footer>
  )
}
