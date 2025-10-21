import { useState } from "react";
import { supabaseClient } from "@/db/supabase.client";

interface DeleteAccountErrors {
  passwordConfirm?: string;
  general?: string;
}

export function useDeleteAccount() {
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<DeleteAccountErrors>({});

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    if (!passwordConfirm) {
      setErrors({ passwordConfirm: "Password confirmation is required." });
      setIsLoading(false);
      return;
    }

    // In a real application, you would send the passwordConfirm to a secure backend endpoint
    // to verify the user's identity and then trigger the account deletion process.
    // For this example, we'll simulate a successful deletion after a delay.

    // Simulate API call to backend for account deletion
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // After successful deletion on the backend, sign out the user from Supabase
    const { error: signOutError } = await supabaseClient.auth.signOut();

    setIsLoading(false);

    if (signOutError) {
      setErrors({ general: signOutError.message });
    } else {
      setMessage("Your account has been successfully deleted. Redirecting...");
      setPasswordConfirm("");
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return {
    passwordConfirm,
    setPasswordConfirm,
    isLoading,
    message,
    errors,
    handleDeleteAccount,
  };
}
