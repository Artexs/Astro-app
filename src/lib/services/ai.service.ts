import OpenAI from "openai";
import type { GeneratedFlashcardDto } from "@/lib/types";

interface ChatOptions {
  systemMessage?: string;
  userMessage: string;
  response_format?: {
    type: "json_object";
  };
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

class OpenAiService {
  private openai: OpenAI;
  private defaultModel = "gpt-4o-mini";

  constructor() {
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables.");
    }
    this.openai = new OpenAI({ apiKey });
  }

  async chat(options: ChatOptions): Promise<any> {
    const { systemMessage, userMessage, response_format, model, temperature, max_tokens } = options;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (systemMessage) {
      messages.push({ role: "system", content: systemMessage });
    }

    messages.push({ role: "user", content: userMessage });

    try {
      const response = await this.openai.chat.completions.create({
        model: model || this.defaultModel,
        messages,
        response_format: response_format,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2048,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content in API response.");
      }

      if (response_format?.type === "json_object") {
        return JSON.parse(content);
      }

      return content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }
}

const WORD_COUNT_MIN = 1000;
const WORD_COUNT_MAX = 10000;

export async function generateFlashcards(text: string): Promise<GeneratedFlashcardDto[]> {
  const wordCount = text.split(/\s+/).length;
  if (wordCount < WORD_COUNT_MIN || wordCount > WORD_COUNT_MAX) {
    throw new Error(`Text must be between ${WORD_COUNT_MIN} and ${WORD_COUNT_MAX} words.`);
  }

  const openAiService = new OpenAiService();

  // TODO: Use a better system prompt
  const systemPrompt = `You are an expert flashcard creator. Create a JSON object with a single key "flashcards", which is an array of objects. Each object should have a "question" and "answer" property.`;

  const response = await openAiService.chat({
    systemMessage: systemPrompt,
    userMessage: `Generate flashcards from the following text: ${text}`,
    response_format: {
      type: "json_object",
    },
  });

  if (!response.flashcards) {
    throw new Error("AI response did not contain flashcards. The response was: " + JSON.stringify(response));
  }

  return response.flashcards;
}
