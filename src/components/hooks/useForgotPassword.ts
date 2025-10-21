import { useState } from "react";
import { supabaseClient } from "@/db/supabase.client";

interface ForgotPasswordErrors {
  email?: string;
  general?: string;
}

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // For success/error messages
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required." });
      setIsLoading(false);
      return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setErrors({ general: error.message });
    } else {
      setMessage("If an account with that email exists, a password reset link has been sent.");
      setEmail(""); // Clear email input
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    message,
    errors,
    handleSubmit,
  };
}
