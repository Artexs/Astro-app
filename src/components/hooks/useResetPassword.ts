import { useState, useEffect } from "react";
import { supabaseClient } from "@/db/supabase.client";

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Parse access_token from URL hash
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove '#' prefix
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const newErrors: ResetPasswordErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8+ characters with uppercase, lowercase, and a number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    if (!accessToken) {
      setErrors({ general: "No access token found. Please use the link from your email." });
      setIsLoading(false);
      return;
    }

    // Set the session with the access token from the URL
    const { error: setSessionError } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: "",
    });

    if (setSessionError) {
      setErrors({ general: setSessionError.message });
      setIsLoading(false);
      return;
    }

    // Update the user's password
    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: password,
    });

    setIsLoading(false);

    if (updateError) {
      setErrors({ general: updateError.message });
    } else {
      setMessage("Your password has been reset successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
      // Redirect to login page after a short delay to show the message
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    message,
    errors,
    handleSubmit,
  };
}
