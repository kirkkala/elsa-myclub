import { render, screen, fireEvent } from '@testing-library/react'
import SelectOrInput from '../SelectOrInput'

const uiTexts = {
  label: 'Test Label',
  description: 'Test description',
  toInputText: 'Switch to input',
  toInputAction: 'Add custom text',
  toListText: 'Found it?',
  toListAction: 'Select from list',
  placeholder: 'Enter custom value'
}

describe('SelectOrInput', () => {
  const mockProps = {
    id: 'test-field',
    label: uiTexts.label,
    description: uiTexts.description,
    Icon: () => <span>icon</span>,
    options: [
      { value: 'Team A', label: 'Team A' },
      { value: 'Team B', label: 'Team B' }
    ],
    placeholder: uiTexts.placeholder,
    required: true,
    teamPrefix: 'Team',
    switchText: {
      toInput: {
        text: uiTexts.toInputText,
        action: uiTexts.toInputAction
      },
      toList: {
        text: uiTexts.toListText,
        action: uiTexts.toListAction
      }
    }
  }

  it('renders select field by default with all elements', () => {
    render(<SelectOrInput {...mockProps} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText(uiTexts.label)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.description)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.toInputText)).toBeInTheDocument()
  })

  it('shows custom input with correct text when switching modes', () => {
    render(<SelectOrInput {...mockProps} />)

    // Check initial state
    expect(screen.getByRole('combobox')).toBeInTheDocument()

    // Switch to input
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(uiTexts.placeholder)).toBeInTheDocument()
    expect(screen.getByText(uiTexts.toListText)).toBeInTheDocument()
  })

  it('returns to select field when switching back', () => {
    render(<SelectOrInput {...mockProps} />)
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    fireEvent.click(screen.getByText(uiTexts.toListAction))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('strips team prefix from select options', () => {
    const props = {
      ...mockProps,
      options: [
        { value: 'Team First Team', label: 'Team First Team' },
        { value: 'Team Second Team', label: 'Team Second Team' }
      ]
    }
    render(<SelectOrInput {...props} />)
    expect(screen.getByText('First Team')).toBeInTheDocument()
    expect(screen.getByText('Second Team')).toBeInTheDocument()
  })

  it('maintains required attribute in both modes', () => {
    render(<SelectOrInput {...mockProps} />)

    // Check select is required
    expect(screen.getByRole('combobox')).toHaveAttribute('required')

    // Switch to input and check
    fireEvent.click(screen.getByText(uiTexts.toInputAction))
    expect(screen.getByRole('textbox')).toHaveAttribute('required')
  })
})
