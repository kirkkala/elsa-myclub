import { IconType } from 'react-icons'
import styles from './Button.module.scss'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  Icon?: IconType
  children: React.ReactNode
  onClick?: () => void
}

export default function Button({
  type = 'button',
  disabled = false,
  Icon,
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styles.button}
    >
      {Icon && <Icon />}
      {children}
    </button>
  )
}
