import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../../src/pages/login'

describe('Login', () => {
  it('should render the login page', () => {
    render(<Login />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})