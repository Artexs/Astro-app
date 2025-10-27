import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResetPasswordForm from "~/components/views/auth/ResetPasswordForm";
import { useResetPassword } from "~/components/hooks/useResetPassword";

// Mock the useResetPassword hook
vi.mock("~/components/hooks/useResetPassword", () => ({
  useResetPassword: vi.fn(),
}));

const mockUseResetPassword = (
  password = "",
  confirmPassword = "",
  isLoading = false,
  message = "",
  errors = {},
  handleSubmit = vi.fn(),
  setPassword = vi.fn(),
  setConfirmPassword = vi.fn()
) => {
  (useResetPassword as vi.Mock).mockReturnValue({
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    message,
    errors,
    handleSubmit,
  });
};

describe("ResetPasswordForm", () => {
  it("should render the reset password form correctly", () => {
    mockUseResetPassword();
    render(<ResetPasswordForm />);

    expect(
      screen.getByText("Reset Password", { selector: '[data-slot="card-title"]', exact: true })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("New Password", { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password", { exact: true })).toBeInTheDocument();
    const resetButton = screen.getByRole("button", { name: /reset password/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeDisabled(); // Initially disabled
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should update password fields on input change and enable button", () => {
    const setPasswordMock = vi.fn();
    const setConfirmPasswordMock = vi.fn();
    mockUseResetPassword("", "", false, "", {}, vi.fn(), setPasswordMock, setConfirmPasswordMock);
    const { rerender } = render(<ResetPasswordForm />);

    const newPasswordInput = screen.getByLabelText("New Password", { exact: true });
    const confirmNewPasswordInput = screen.getByLabelText("Confirm New Password", { exact: true });
    let resetButton = screen.getByRole("button", { name: /reset password/i });

    expect(resetButton).toBeDisabled();

    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    expect(setPasswordMock).toHaveBeenCalledWith("newpassword123");

    fireEvent.change(confirmNewPasswordInput, { target: { value: "newpassword123" } });
    expect(setConfirmPasswordMock).toHaveBeenCalledWith("newpassword123");

    // Re-render with updated passwords to reflect enabled state
    mockUseResetPassword(
      "newpassword123",
      "newpassword123",
      false,
      "",
      {},
      vi.fn(),
      setPasswordMock,
      setConfirmPasswordMock
    );
    rerender(<ResetPasswordForm />);
    resetButton = screen.getByRole("button", { name: /reset password/i });
    expect(resetButton).toBeEnabled();
  });

  it("should call handleSubmit on form submission", async () => {
    const handleSubmitMock = vi.fn((e) => e.preventDefault());
    mockUseResetPassword("newpassword123", "newpassword123", false, "", {}, handleSubmitMock);
    render(<ResetPasswordForm />);

    const form = screen.getByRole("form", { name: "Reset Password Form" });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  it("should display a success message if password reset is successful", () => {
    const successMessage = "Password reset successfully";
    mockUseResetPassword("", "", false, successMessage, {});
    render(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Success", { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it("should display a general error message if reset fails", () => {
    const errorMessage = "Invalid or expired token";
    mockUseResetPassword("", "", false, "", { general: errorMessage });
    render(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error", { selector: '[data-slot="alert-title"]', exact: true })).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display field-specific error messages", () => {
    const passwordError = "Password too weak";
    const confirmPasswordError = "Passwords do not match";
    mockUseResetPassword("", "", false, "", { password: passwordError, confirmPassword: confirmPasswordError });
    render(<ResetPasswordForm />);

    expect(screen.getByText(passwordError)).toBeInTheDocument();
    expect(screen.getByText(confirmPasswordError)).toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
    mockUseResetPassword("newpassword123", "newpassword123", true);
    render(<ResetPasswordForm />);

    const resetButton = screen.getByRole("button", { name: /resetting.../i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeDisabled();
  });
});
