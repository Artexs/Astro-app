import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/db/database.types";

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key must be provided as environment variables.");
}

// Simple in-memory cookie store for Node.js environment
const inMemoryCookies: Record<string, string> = {};

const supabase = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: {
    get(key: string) {
      return inMemoryCookies[key];
    },
    set(key: string, value: string, options: any) {
      inMemoryCookies[key] = value;
    },
    remove(key: string, options: any) {
      delete inMemoryCookies[key];
    },
  },
});

const API_BASE_URL = process.env.PUBLIC_API_BASE_URL || "http://localhost:3000/api"; // Adjust if your API is on a different port/path

export async function registerUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    throw new Error(`Failed to login user: ${signInError.message}`);
  }

  let session = signInData.session;
  let user = signInData.user;

  if (!session) {
    const {
      data: { session: fetchedSession, user: fetchedUser },
      error: fetchError,
    } = await supabase.auth.getSession();
    if (fetchError) {
      throw new Error(`Failed to retrieve session after login: ${fetchError.message}`);
    }
    if (!fetchedSession) {
      throw new Error("Login successful but no session found after explicit fetch.");
    }
    session = fetchedSession;
    user = fetchedUser;
  }

  if (!session.access_token) {
    throw new Error("Login successful but access token not found in session.");
  }

  return { session, user };
}

export async function createFlashcard(token: string, front: string, back: string, tags: string[] = []) {
  const response = await fetch(`${API_BASE_URL}/flashcards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question: front, answer: back }), // Changed to question/answer based on API
  });
  if (!response.ok) {
    throw new Error(`Failed to create flashcard: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteFlashcard(token: string, flashcardId: number) {
  // Changed flashcardId to number
  const response = await fetch(`${API_BASE_URL}/flashcards/${flashcardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete flashcard: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteUser(userId: string) {
  // Deleting users directly via client-side Supabase is not typically allowed for security reasons.
  // This would usually require a service role key or admin privileges.
  // For E2E testing, we might need to manually clean up or use a dedicated test user.
  // For now, we'll leave this as a placeholder or consider alternative cleanup strategies.
  console.warn(
    "Direct user deletion via client-side Supabase is not recommended for E2E tests without admin privileges."
  );
  // Example if you had an admin client:
  // const { error } = await supabase.auth.admin.deleteUser(userId);
  // if (error) {
  //   throw new Error(`Failed to delete user: ${error.message}`);
  // }
  return { message: "User deletion attempted (requires admin privileges)." };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
}
