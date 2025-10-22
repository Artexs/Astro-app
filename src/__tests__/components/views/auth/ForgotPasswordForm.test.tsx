import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPasswordForm from '~/components/views/auth/ForgotPasswordForm';
import { useForgotPassword } from '~/components/hooks/useForgotPassword';

// Mock the useForgotPassword hook
vi.mock('~/components/hooks/useForgotPassword', () => ({
  useForgotPassword: vi.fn(),
}));

const mockUseForgotPassword = (
  email = '',
  isLoading = false,
  message = '',
  errors = {},
  handleSubmit = vi.fn(),
  setEmail = vi.fn()
) => {
  (useForgotPassword as vi.Mock).mockReturnValue({
    email,
    setEmail,
    isLoading,
    message,
    errors,
    handleSubmit,
  });
};

describe('ForgotPasswordForm', () => {
  it('should render the forgot password form correctly', () => {
    mockUseForgotPassword();
    render(<ForgotPasswordForm />);

    expect(screen.getByText('Forgot Password', { selector: '[data-slot="card-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const sendResetLinkButton = screen.getByRole('button', { name: /send reset link/i });
    expect(sendResetLinkButton).toBeInTheDocument();
    expect(sendResetLinkButton).toBeDisabled(); // Initially disabled
    expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should update email on input change and enable button', () => {
    const setEmailMock = vi.fn();
    mockUseForgotPassword('', false, '', {}, vi.fn(), setEmailMock);
    const { rerender } = render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    let sendResetLinkButton = screen.getByRole('button', { name: /send reset link/i });

    expect(sendResetLinkButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(setEmailMock).toHaveBeenCalledWith('test@example.com');

    // Re-render with updated email to reflect enabled state
    mockUseForgotPassword('test@example.com', false, '', {}, vi.fn(), setEmailMock);
    rerender(<ForgotPasswordForm />);
    sendResetLinkButton = screen.getByRole('button', { name: /send reset link/i });
    expect(sendResetLinkButton).toBeEnabled();
  });

  it('should call handleSubmit on form submission', async () => {
    const handleSubmitMock = vi.fn((e) => e.preventDefault());
    mockUseForgotPassword('test@example.com', false, '', {}, handleSubmitMock);
    render(<ForgotPasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should display a success message if reset link is sent', () => {
    const successMessage = 'Password reset email sent';
    mockUseForgotPassword('', false, successMessage, {});
    render(<ForgotPasswordForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('should display a general error message if reset fails', () => {
    const errorMessage = 'User not found';
    mockUseForgotPassword('', false, '', { general: errorMessage });
    render(<ForgotPasswordForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should display field-specific error messages', () => {
    const emailError = 'Invalid email format';
    mockUseForgotPassword('', false, '', { email: emailError });
    render(<ForgotPasswordForm />);

    expect(screen.getByText(emailError)).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    mockUseForgotPassword('test@example.com', true);
    render(<ForgotPasswordForm />);

    const sendResetLinkButton = screen.getByRole('button', { name: /sending.../i });
    expect(sendResetLinkButton).toBeInTheDocument();
    expect(sendResetLinkButton).toBeDisabled();
  });
});
