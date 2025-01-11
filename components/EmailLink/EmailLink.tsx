import { SITE_CONFIG, getMailtoLink } from '../../config'

interface EmailLinkProps {
  showAddress?: boolean
  children?: React.ReactNode
}

export default function EmailLink({ showAddress = true, children }: EmailLinkProps) {
  return (
    <a href={getMailtoLink()}>
      {children || (showAddress ? SITE_CONFIG.email.address : 'Timo Kirkkala')}
    </a>
  )
}
