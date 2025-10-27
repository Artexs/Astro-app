import { useState } from "react";
import { supabaseClient } from "@/db/supabase.client";

interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  general?: string;
}

export function useChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const newErrors: ChangePasswordErrors = {};

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "New passwords do not match.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = "New password must be 8+ characters with uppercase, lowercase, and a number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Supabase's updateUser method for password change does not require the current password
    // if the user is already authenticated. However, for security best practices, you might
    // want to re-authenticate the user with their current password before allowing a change.
    // This example directly updates the password assuming the user is authenticated.
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    setIsLoading(false);

    if (error) {
      setErrors({ general: error.message });
    } else {
      setMessage("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return {
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
  };
}
