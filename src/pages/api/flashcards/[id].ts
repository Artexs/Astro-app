import type { APIRoute } from "astro";
import { deleteFlashcard } from "@/lib/services/flashcard.service";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { session, supabase } = locals;

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = Number(params.id);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await deleteFlashcard(supabase, id);
    return new Response(JSON.stringify({ message: "Flashcard deleted successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    // Check for specific error codes from Supabase to return 403 or 404
    if (error instanceof Error && error.message.includes("violates row-level security policy")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
