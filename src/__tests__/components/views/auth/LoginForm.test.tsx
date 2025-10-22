import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '~/components/views/auth/LoginForm';
import { useLogin } from '~/components/hooks/useLogin';

// Mock the useLogin hook
vi.mock('~/components/hooks/useLogin', () => ({
  useLogin: vi.fn(),
}));

const mockUseLogin = (
  email = '',
  password = '',
  error = null,
  isLoading = false,
  handleSubmit = vi.fn(),
  setEmail = vi.fn(),
  setPassword = vi.fn()
) => {
  (useLogin as vi.Mock).mockReturnValue({
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  });
};

describe('LoginForm', () => {
  it('should render the login form correctly', () => {
    mockUseLogin();
    render(<LoginForm />);

    expect(screen.getByText('Login', { selector: '[data-slot="card-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password?/i })).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should update email and password on input change', () => {
    const setEmailMock = vi.fn();
    const setPasswordMock = vi.fn();
    mockUseLogin('', '', null, false, vi.fn(), setEmailMock, setPasswordMock);
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(setEmailMock).toHaveBeenCalledWith('test@example.com');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(setPasswordMock).toHaveBeenCalledWith('password123');
  });

  it('should call handleSubmit on form submission', async () => {
    const handleSubmitMock = vi.fn((e) => e.preventDefault()); // Prevent default form submission
    mockUseLogin('test@example.com', 'password123', null, false, handleSubmitMock);
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should display an error message if login fails', () => {
    const errorMessage = 'Invalid credentials';
    mockUseLogin('test@example.com', 'password123', errorMessage, false);
    render(<LoginForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    mockUseLogin('test@example.com', 'password123', null, true);
    render(<LoginForm />);

    const loginButton = screen.getByRole('button', { name: /logging in.../i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });
});
