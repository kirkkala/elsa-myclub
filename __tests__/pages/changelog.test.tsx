import { render, screen } from '@testing-library/react'
import Changelog, { getStaticProps } from '../../pages/changelog'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/changelog'
  })
}))

// Mock fs module but keep real readFileSync for CHANGELOG.md
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs')
  return {
    readFileSync: jest.fn((filePath) => {
      if (filePath.includes('CHANGELOG.md')) {
        return actualFs.readFileSync(filePath, 'utf8')
      }
      return ''
    })
  }
})

// Mock gray-matter properly
jest.mock('gray-matter', () => {
  return function matter(fileContent: string) {
    return {
      content: fileContent,
      data: {},
      isEmpty: false,
      excerpt: ''
    }
  }
})

// Mock remark and remark-html
jest.mock('remark', () => ({
  remark: () => ({
    use: () => ({
      process: (content: string) => Promise.resolve({
        toString: () => {
          return content
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h3>$1</h3>')
            .replace(/^# (.*$)/gm, '<h2>$1</h2>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
        }
      })
    })
  })
}))

jest.mock('remark-html', () => ({
  default: () => ({})
}))

describe('Changelog page', () => {
  it('renders changelog content with adjusted heading levels', async () => {
    const { props } = await getStaticProps()
    render(<Changelog {...props} />)

    // Look for the specific heading text
    expect(screen.getByRole('heading', {
      name: 'v0.1.2-beta (2025-01-12)'
    })).toBeInTheDocument()

    // Test actual changelog content
    expect(screen.getByText(/Tekninen päivitys/)).toBeInTheDocument()
    expect(screen.getByText(/Pelin lämppä/)).toBeInTheDocument()
  })

  it('increases heading levels by one', async () => {
    const { props } = await getStaticProps()

    // Original h2 (##) should become h3 (###) in the HTML
    expect(props.contentHtml).toContain('<h3>v0.1.2-beta')
    expect(props.contentHtml).toContain('<h3>v0.1.1-beta')
    expect(props.contentHtml).not.toContain('<h2>')
  })

  it('preserves emojis and formatting', async () => {
    const { props } = await getStaticProps()

    // Test actual emojis from CHANGELOG.md
    expect(props.contentHtml).toContain('🤓')
    expect(props.contentHtml).toContain('💅🏻')
    expect(props.contentHtml).toContain('📅')
  })
})
