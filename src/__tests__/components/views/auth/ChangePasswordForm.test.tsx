import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChangePasswordForm from '~/components/views/auth/ChangePasswordForm';
import { useChangePassword } from '~/components/hooks/useChangePassword';

// Mock the useChangePassword hook
vi.mock('~/components/hooks/useChangePassword', () => ({
  useChangePassword: vi.fn(),
}));

const mockUseChangePassword = (
  currentPassword = '',
  newPassword = '',
  confirmNewPassword = '',
  isLoading = false,
  message = '',
  errors = {},
  handleSubmit = vi.fn(),
  setCurrentPassword = vi.fn(),
  setNewPassword = vi.fn(),
  setConfirmNewPassword = vi.fn()
) => {
  (useChangePassword as vi.Mock).mockReturnValue({
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    isLoading,
    message,
    errors,
    handleSubmit,
  });
};

describe('ChangePasswordForm', () => {
  it('should render the change password form correctly', () => {
    mockUseChangePassword();
    render(<ChangePasswordForm />);

    expect(screen.getByText('Change Password', { selector: '[data-slot="card-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password', { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText('New Password', { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/password changed successfully/i)).not.toBeInTheDocument();
  });

  it('should update password fields on input change', () => {
    const setCurrentPasswordMock = vi.fn();
    const setNewPasswordMock = vi.fn();
    const setConfirmNewPasswordMock = vi.fn();
    mockUseChangePassword(
      '', '', '', false, '', {},
      vi.fn(),
      setCurrentPasswordMock,
      setNewPasswordMock,
      setConfirmNewPasswordMock
    );
    render(<ChangePasswordForm />);

    const currentPasswordInput = screen.getByLabelText('Current Password', { exact: true });
    const newPasswordInput = screen.getByLabelText('New Password', { exact: true });
    const confirmNewPasswordInput = screen.getByLabelText('Confirm New Password', { exact: true });

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
    expect(setCurrentPasswordMock).toHaveBeenCalledWith('oldpassword');

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    expect(setNewPasswordMock).toHaveBeenCalledWith('newpassword123');

    fireEvent.change(confirmNewPasswordInput, { target: { value: 'newpassword123' } });
    expect(setConfirmNewPasswordMock).toHaveBeenCalledWith('newpassword123');
  });

  it('should call handleSubmit on form submission', async () => {
    const handleSubmitMock = vi.fn((e) => e.preventDefault());
    mockUseChangePassword('oldpassword', 'newpassword123', 'newpassword123', false, '', {}, handleSubmitMock);
    render(<ChangePasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should display a success message if password change is successful', () => {
    const successMessage = 'Password changed successfully';
    mockUseChangePassword('', '', '', false, successMessage, {});
    render(<ChangePasswordForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('should display a general error message if password change fails', () => {
    const errorMessage = 'Incorrect current password';
    mockUseChangePassword('', '', '', false, '', { general: errorMessage });
    render(<ChangePasswordForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should display field-specific error messages', () => {
    const newPasswordError = 'Password too short';
    const confirmNewPasswordError = 'Passwords do not match';
    mockUseChangePassword(
      '', '', '', false, '',
      { newPassword: newPasswordError, confirmNewPassword: confirmNewPasswordError }
    );
    render(<ChangePasswordForm />);

    expect(screen.getByText(newPasswordError)).toBeInTheDocument();
    expect(screen.getByText(confirmNewPasswordError)).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    mockUseChangePassword('', '', '', true);
    render(<ChangePasswordForm />);

    const changePasswordButton = screen.getByRole('button', { name: /changing.../i });
    expect(changePasswordButton).toBeInTheDocument();
    expect(changePasswordButton).toBeDisabled();
  });
});
