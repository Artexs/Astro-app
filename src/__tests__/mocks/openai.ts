import { vi } from 'vitest';

export const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn(() => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ flashcards: [{ question: 'Q1', answer: 'A1' }] }),
            },
          },
        ],
      })),
    },
  },
};

// Mock the OpenAI constructor
vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI),
}));