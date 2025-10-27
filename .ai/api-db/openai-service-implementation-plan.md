# OpenAI Service Implementation Plan

## 1. Service Description

The `OpenAiService` is a server-side module responsible for all interactions with the OpenAI API. It provides a streamlined interface for making chat completion requests, handling authentication, and managing API configurations. This service is designed to be used within Astro API routes to ensure that the API key and other sensitive information are not exposed to the client.

## 2. Constructor Description

The service is implemented as a TypeScript class. The constructor initializes the OpenAI API client using the official `openai` npm package.

- **`constructor()`**:
  - Retrieves the OpenAI API key from the environment variables (`process.env.OPENAI_API_KEY`).
  - If the API key is not found, it throws an error to prevent the service from being used without proper authentication.
  - Initializes the `OpenAI` client instance.

## 3. Public Methods and Fields

- **`async chat(options: ChatOptions): Promise<string | object>`**:
  - The primary method for making a chat completion request.
  - `options`: An object containing the parameters for the chat request.
    - `systemMessage?: string`: The system message to set the context for the AI model.
    - `userMessage: string`: The user's input.
    - `response_format?: object`: The desired response format (e.g., for structured JSON).
    - `model?: string`: The model to use for the request (overrides the default).
    - `temperature?: number`: The sampling temperature.
    - `max_tokens?: number`: The maximum number of tokens to generate.
  - Returns the content of the AI's response, which can be a string or a JSON object if `response_format` is used.

## 4. Private Methods and Fields

- **`private openai: OpenAI`**:
  - The instance of the OpenAI client.
- **`private defaultModel: string`**:
  - The default model to be used for chat completions (e.g., `'gpt-4-turbo'`).

## 5. Error Handling

The service will implement robust error handling to manage various API and network issues:

- **`ApiError`**: A custom error class for API-related errors.
- **`NetworkError`**: A custom error class for network connectivity issues.
- **`BadRequestError`**: Thrown for `400` errors when the request payload is invalid.
- **`AuthenticationError`**: Thrown for `401` errors when the API key is invalid.
- **`RateLimitError`**: Thrown for `429` errors. The service should implement a retry mechanism with exponential backoff for these errors.
- **`ServiceUnavailableError`**: Thrown for `5xx` server errors from the API.

## 6. Security Considerations

- **API Key Management**: The OpenAI API key must be stored securely in environment variables and should never be exposed on the client-side. The service should only be instantiated and used in server-side code (Astro API routes).
- **Input Validation**: While not the direct responsibility of this service, the calling code should validate and sanitize all user input before passing it to the `chat` method to prevent prompt injection attacks.

## 7. Step-by-Step Implementation Plan

1.  **Install Dependencies**:
    - Install the official OpenAI npm package:
      ```bash
      npm install openai
      ```

2.  **Create the Service File**:
    - Create a new file at `src/lib/services/openai.service.ts`.

3.  **Implement the `OpenAiService` Class**:
    - Define the class and its constructor.
    - Implement the `chat` method.
    - Add the necessary types and interfaces.

    ```typescript
    // src/lib/services/openai.service.ts

    import OpenAI from "openai";

    interface ChatOptions {
      systemMessage?: string;
      userMessage: string;
      response_format?: {
        type: "json_object";
        json_schema: {
          name: string;
          strict: boolean;
          schema: object;
        };
      };
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }

    export class OpenAiService {
      private openai: OpenAI;
      private defaultModel = "gpt-4-turbo";

      constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error("OPENAI_API_KEY is not set in environment variables.");
        }
        this.openai = new OpenAI({ apiKey });
      }

      async chat(options: ChatOptions): Promise<string | object> {
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
            response_format: response_format as any, // The official type is not up-to-date
            temperature: temperature || 0.7,
            max_tokens: max_tokens || 1024,
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
          // Implement custom error handling here
          console.error("Error calling OpenAI API:", error);
          throw error;
        }
      }
    }
    ```

4.  **Set Up Environment Variables**:
    - Add `OPENAI_API_KEY` to your `.env` file for local development:
      ```
      OPENAI_API_KEY="your-api-key-here"
      ```
    - Ensure this environment variable is also set in your production environment.

5.  **Usage in an Astro API Route**:
    - Create an API route to use the service, for example, `src/pages/api/generate.ts`.

    ```typescript
    // src/pages/api/generate.ts

    import type { APIRoute } from "astro";
    import { OpenAiService } from "../../lib/services/openai.service";

    export const POST: APIRoute = async ({ request }) => {
      const { text } = await request.json();

      if (!text) {
        return new Response(JSON.stringify({ error: "Text is required." }), { status: 400 });
      }

      const openAiService = new OpenAiService();

      try {
        const flashcards = await openAiService.chat({
          systemMessage: "You are an expert flashcard creator.",
          userMessage: `Generate 5 flashcards from the following text: ${text}`,
          response_format: {
            type: "json_object",
            json_schema: {
              name: "flashcard_generation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  flashcards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                      },
                      required: ["question", "answer"],
                    },
                  },
                },
                required: ["flashcards"],
              },
            },
          },
        });

        return new Response(JSON.stringify(flashcards), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to generate flashcards." }), { status: 500 });
      }
    };
    ```
