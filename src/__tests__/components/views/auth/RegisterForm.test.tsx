import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RegisterForm from "~/components/views/auth/RegisterForm";
import { useRegister } from "~/components/hooks/useRegister";

// Mock the useRegister hook
vi.mock("~/components/hooks/useRegister", () => ({
  useRegister: vi.fn(),
}));

const mockUseRegister = (
  email = "",
  password = "",
  confirmPassword = "",
  errors = {},
  isLoading = false,
  handleSubmit = vi.fn(),
  setEmail = vi.fn(),
  setPassword = vi.fn(),
  setConfirmPassword = vi.fn()
) => {
  (useRegister as vi.Mock).mockReturnValue({
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    handleSubmit,
  });
};

describe("RegisterForm", () => {
  it("should render the registration form correctly", () => {
    mockUseRegister();
    render(<RegisterForm />);

    expect(
      screen.getByText("Create an account", { selector: '[data-slot="card-title"]', exact: true })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it("should update email, password, and confirm password on input change", () => {
    const setEmailMock = vi.fn();
    const setPasswordMock = vi.fn();
    const setConfirmPasswordMock = vi.fn();
    mockUseRegister("", "", "", {}, false, vi.fn(), setEmailMock, setPasswordMock, setConfirmPasswordMock);
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password", { exact: true });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(setEmailMock).toHaveBeenCalledWith("test@example.com");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(setPasswordMock).toHaveBeenCalledWith("password123");

    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    expect(setConfirmPasswordMock).toHaveBeenCalledWith("password123");
  });

  it("should call handleSubmit on form submission", async () => {
    const handleSubmitMock = vi.fn((e) => e.preventDefault());
    mockUseRegister("test@example.com", "password123", "password123", {}, false, handleSubmitMock);
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  it("should display a general error message if registration fails", () => {
    const errorMessage = "Registration failed";
    mockUseRegister("test@example.com", "password123", "password123", { general: errorMessage }, false);
    render(<RegisterForm />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Registration Failed", { selector: '[data-slot="alert-title"]', exact: true })
    ).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display field-specific error messages", () => {
    const emailError = "Invalid email";
    const passwordError = "Password too short";
    const confirmPasswordError = "Passwords do not match";
    mockUseRegister(
      "invalid",
      "short",
      "mismatch",
      { email: emailError, password: passwordError, confirmPassword: confirmPasswordError },
      false
    );
    render(<RegisterForm />);

    expect(screen.getByText(emailError)).toBeInTheDocument();
    expect(screen.getByText(passwordError)).toBeInTheDocument();
    expect(screen.getByText(confirmPasswordError)).toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
    mockUseRegister("test@example.com", "password123", "password123", {}, true);
    render(<RegisterForm />);

    const createAccountButton = screen.getByRole("button", { name: /creating account.../i });
    expect(createAccountButton).toBeInTheDocument();
    expect(createAccountButton).toBeDisabled();
  });
});
