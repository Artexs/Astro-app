
import { useState } from "react";
import { supabaseClient } from "@/db/supabase.client";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      // On success, Supabase client handles the session and the page will redirect.
      // For Astro, a full page reload is often best to re-evaluate server-side logic.
      window.location.href = "/my-cards";

    } catch (catchError: any) {
      setError(catchError.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
}
