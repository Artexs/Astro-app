// import { google_web_search } from "@google/generative-ai-function-calling";
import type { GeneratedFlashcardDto } from "@/lib/types";

const WORD_COUNT_MIN = 1000;
const WORD_COUNT_MAX = 10000;

export async function generateFlashcards(text: string): Promise<GeneratedFlashcardDto[]> {
  const wordCount = text.split(/\s+/).length;
  if (wordCount < WORD_COUNT_MIN || wordCount > WORD_COUNT_MAX) {
    throw new Error(`Text must be between ${WORD_COUNT_MIN} and ${WORD_COUNT_MAX} words.`);
  }

  // This is a placeholder for a real AI service call.
  // We are using google_web_search as a stand-in to simulate an external API call.
  // const searchResults = await google_web_search({ query: text });

  // In a real implementation, you would parse the AI's response.
  // Here, we are just returning dummy data based on the search results.
  // const flashcards: GeneratedFlashcardDto[] = searchResults.results.slice(0, 5).map((result: any) => ({
  //   question: result.title,
  //   answer: result.snippet,
  // }));
  const flashcards: GeneratedFlashcardDto[] = [
    {
      question: "What is the capital of France?",
      answer: "Paris",
    },
    {
      question: "What is the formula for water?",
      answer: "H2O",
    },
  ];

  if (flashcards.length === 0) {
    // Return some dummy data if no results are found
    return [
      {
        question: "What is the capital of France?",
        answer: "Paris",
      },
      {
        question: "What is the formula for water?",
        answer: "H2O",
      },
    ];
  }

  return flashcards;
}
