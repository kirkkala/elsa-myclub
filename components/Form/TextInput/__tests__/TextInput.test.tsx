import { render, screen } from '@testing-library/react'
import { LuUser } from 'react-icons/lu'
import TextInput from '../TextInput'

describe('TextInput', () => {
  const mockProps = {
    id: 'test-input',
    label: 'Test Label',
    description: 'Test description',
    Icon: LuUser,
    placeholder: 'Enter value'
  }

  it('renders basic input with all elements', () => {
    render(<TextInput {...mockProps} />)

    expect(screen.getByLabelText(/Test Label/i)).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument()
  })

  it('renders suffix when provided', () => {
    const suffix = <span>Test Suffix</span>
    render(<TextInput {...mockProps} suffix={suffix} />)

    expect(screen.getByText('Test Suffix')).toBeInTheDocument()
    expect(screen.getByText('Test Suffix').parentElement).toHaveClass('suffix')
  })

  it('handles required attribute', () => {
    render(<TextInput {...mockProps} required />)
    expect(screen.getByRole('textbox')).toHaveAttribute('required')
  })
})
