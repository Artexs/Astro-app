import type { APIRoute } from "astro";
import { getRandomFlashcard } from "@/lib/services/flashcard.service";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const { session, supabase } = locals;

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const randomFlashcard = await getRandomFlashcard(supabase, session.user.id);
    return new Response(JSON.stringify({ data: randomFlashcard }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes("No flashcards found")) {
      return new Response(JSON.stringify({ error: "No flashcards found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};