import type { SupabaseClient } from "@/db/supabase.client";
import type { FlashcardListItemDto } from "@/lib/types";

interface GetUserFlashcardsResult {
  data: FlashcardListItemDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export async function getUserFlashcards(
  supabase: SupabaseClient,
  userId: string,
  page: number,
  limit: number
): Promise<GetUserFlashcardsResult> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const flashcardsPromise = supabase
    .from("flashcards")
    .select("id,question,answer,state")
    .eq("user_id", userId)
    .range(from, to);

  const countPromise = supabase.from("flashcards").select("count", { count: "exact" }).eq("user_id", userId);

  const [{ data: flashcards, error }, { data: countData, error: countError }] = await Promise.all([
    flashcardsPromise,
    countPromise,
  ]);

  if (error) {
    throw new Error(error.message);
  }
  if (countError) {
    throw new Error(countError.message);
  }

  const totalItems = countData?.[0]?.count ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: flashcards ?? [],
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  };
}
