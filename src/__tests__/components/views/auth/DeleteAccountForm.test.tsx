import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteAccountForm from '~/components/views/auth/DeleteAccountForm';
import { useDeleteAccount } from '~/components/hooks/useDeleteAccount';

// Mock the useDeleteAccount hook
vi.mock('~/components/hooks/useDeleteAccount', () => ({
  useDeleteAccount: vi.fn(),
}));

const mockUseDeleteAccount = (
  passwordConfirm = '',
  isLoading = false,
  message = '',
  errors = {},
  handleDeleteAccount = vi.fn(),
  setPasswordConfirm = vi.fn()
) => {
  (useDeleteAccount as vi.Mock).mockReturnValue({
    passwordConfirm,
    setPasswordConfirm,
    isLoading,
    message,
    errors,
    handleDeleteAccount,
  });
};

describe('DeleteAccountForm', () => {
  it('should render the delete account form correctly', () => {
    mockUseDeleteAccount();
    render(<DeleteAccountForm />);

    expect(screen.getByText('Delete Account', { selector: '[data-slot="card-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText('To confirm, type your password', { exact: true })).toBeInTheDocument();
    const deleteButton = screen.getByRole('button', { name: /delete account/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeDisabled(); // Initially disabled
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should enable the delete button when password is typed', () => {
    const setPasswordConfirmMock = vi.fn();
    mockUseDeleteAccount('', false, '', {}, vi.fn(), setPasswordConfirmMock);
    const { rerender } = render(<DeleteAccountForm />);

    const passwordInput = screen.getByLabelText('To confirm, type your password', { exact: true });
    let deleteButton = screen.getByRole('button', { name: /delete account/i });

    expect(deleteButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(setPasswordConfirmMock).toHaveBeenCalledWith('testpassword');

    // Re-render with updated passwordConfirm to reflect enabled state
    mockUseDeleteAccount('testpassword', false, '', {}, vi.fn(), setPasswordConfirmMock);
    rerender(<DeleteAccountForm />);
    deleteButton = screen.getByRole('button', { name: /delete account/i });
    expect(deleteButton).toBeEnabled();
  });

  it('should open and close the AlertDialog', async () => {
    mockUseDeleteAccount('testpassword');
    render(<DeleteAccountForm />);

    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('should call handleDeleteAccount on confirmation', async () => {
    const handleDeleteAccountMock = vi.fn();
    mockUseDeleteAccount('testpassword', false, '', {}, handleDeleteAccountMock);
    render(<DeleteAccountForm />);

    fireEvent.click(screen.getByRole('button', { name: /delete account/i })); // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i })); // Confirm deletion

    await waitFor(() => {
      expect(handleDeleteAccountMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should display a success message after account deletion', () => {
    const successMessage = 'Account deleted successfully';
    mockUseDeleteAccount('', false, successMessage, {});
    render(<DeleteAccountForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('should display a general error message if deletion fails', () => {
    const errorMessage = 'Deletion failed';
    mockUseDeleteAccount('', false, '', { general: errorMessage });
    render(<DeleteAccountForm />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error', { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should display field-specific error messages', () => {
    const passwordConfirmError = 'Incorrect password';
    mockUseDeleteAccount('', false, '', { passwordConfirm: passwordConfirmError });
    render(<DeleteAccountForm />);

    expect(screen.getByText(passwordConfirmError)).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', async () => {
    const { rerender } = render(<DeleteAccountForm />);
    mockUseDeleteAccount('testpassword', false);
    rerender(<DeleteAccountForm />);

    const deleteButtonTrigger = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(deleteButtonTrigger); // Open dialog

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    // Now, simulate isLoading becoming true while the dialog is open
    mockUseDeleteAccount('testpassword', true);
    rerender(<DeleteAccountForm />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const confirmDeleteButton = screen.getByRole('button', { name: /deleting.../i });

    expect(cancelButton).toBeDisabled();
    expect(confirmDeleteButton).toBeInTheDocument();
    expect(confirmDeleteButton).toBeDisabled();
  });
});
