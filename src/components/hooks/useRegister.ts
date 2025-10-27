"use client";

import { useState } from "react";
import { supabaseClient } from "@/db/supabase.client";

interface RegisterErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function useRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: RegisterErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8+ characters with uppercase, lowercase, and a number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes("User already registered")) {
        setErrors({ email: "An account with this email already exists." });
      } else {
        setErrors({ general: error.message });
      }
    } else {
      window.location.href = "/registration-success";
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    handleSubmit,
  };
}
