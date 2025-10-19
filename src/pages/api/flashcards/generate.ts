import type { APIRoute } from "astro";
import { z } from "zod";
import { generateFlashcards } from "@/lib/services/ai.service";

export const prerender = false;

const bodySchema = z.object({
  text: z.string().min(1),
});

export const POST: APIRoute = async ({ request, locals }) => {
  const { session } = locals;

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { text } = bodySchema.parse(body);

    try {
      const generatedFlashcards = await generateFlashcards(text);
      return new Response(JSON.stringify({ data: generatedFlashcards }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("Text must be between")) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
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
