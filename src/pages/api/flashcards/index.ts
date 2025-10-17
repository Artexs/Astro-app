import type { APIRoute } from "astro";
import { z } from "zod";
import { getUserFlashcards } from "@/lib/services/flashcard.service";

export const prerender = false;

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(30),
});

export const GET: APIRoute = async ({ request, locals }) => {
  const { session, supabase } = locals;

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  try {
    const { page, limit } = querySchema.parse(queryParams);

    try {
      const result = await getUserFlashcards(supabase, session.user.id, page, limit);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as z.ZodError).flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
