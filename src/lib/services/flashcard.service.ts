import type { SupabaseClient } from "@/db/supabase.client";
import type { Flashcard, FlashcardListItemDto, StudyFlashcardDto } from "@/lib/types";

export async function createFlashcard(
  supabase: SupabaseClient,
  userId: string,
  question: string,
  answer: string
): Promise<Flashcard> {
  console.log("test - db");
  const { data, error } = await supabase
    .from("flashcards")
    .insert({ user_id: userId, question, answer })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

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

  const countPromise = supabase.from("flashcards").select("*", { count: "exact", head: true }).eq("user_id", userId);

  const [flashcardsResult, countResult] = await Promise.all([flashcardsPromise, countPromise]);

  const { data: flashcards, error } = flashcardsResult;
  const { count, error: countError } = countResult;

  if (error) {
    throw new Error(error.message);
  }
  if (countError) {
    throw new Error(countError.message);
  }

  const totalItems = count ?? 0;
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

export async function deleteFlashcard(supabase: SupabaseClient, flashcardId: number): Promise<void> {
  const { error } = await supabase.from("flashcards").delete().eq("id", flashcardId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getRandomFlashcard(supabase: SupabaseClient, userId: string): Promise<StudyFlashcardDto> {
  // Step 1: Get the total count of flashcards for the user.
  const { count, error: countError } = await supabase
    .from("flashcards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new Error(countError.message);
  }

  if (count === null || count === 0) {
    throw new Error("No flashcards found");
  }

  // Step 2: Generate a random index and fetch one card.
  const randomIndex = Math.floor(Math.random() * count);
  const { data, error } = await supabase
    .from("flashcards")
    .select("id, question, answer")
    .eq("user_id", userId)
    .range(randomIndex, randomIndex)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No flashcards found");
  }

  return data;
}
