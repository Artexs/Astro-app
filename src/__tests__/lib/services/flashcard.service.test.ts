import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockSupabaseClient } from "~/__tests__/mocks/supabase";
import {
  createFlashcard,
  getUserFlashcards,
  deleteFlashcard,
  getRandomFlashcard,
} from "~/lib/services/flashcard.service";

describe("flashcard.service", () => {
  const userId = "test-user-id";

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe("createFlashcard", () => {
    it("should create a flashcard successfully", async () => {
      const mockFlashcard = { id: 1, user_id: userId, question: "Q", answer: "A", created_at: "" };
      mockSupabaseClient.from.mockReturnValue({
        insert: vi
          .fn()
          .mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ single: vi.fn().mockResolvedValueOnce({ data: mockFlashcard, error: null }) }),
          }),
      });

      const result = await createFlashcard(mockSupabaseClient as any, userId, "Q", "A");
      expect(result).toEqual(mockFlashcard);
      expect(mockSupabaseClient.from("flashcards").insert).toHaveBeenCalledWith({
        user_id: userId,
        question: "Q",
        answer: "A",
      });
    });

    it("should throw an error if flashcard creation fails", async () => {
      const mockError = { message: "Failed to create flashcard" };
      mockSupabaseClient.from.mockReturnValue({
        insert: vi
          .fn()
          .mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ single: vi.fn().mockResolvedValueOnce({ data: null, error: mockError }) }),
          }),
      });

      await expect(createFlashcard(mockSupabaseClient as any, userId, "Q", "A")).rejects.toThrow(mockError.message);
    });
  });

  describe("getUserFlashcards", () => {
    it("should return user flashcards with pagination", async () => {
      const mockFlashcards = [
        { id: 1, question: "Q1", answer: "A1", state: "new" },
        { id: 2, question: "Q2", answer: "A2", state: "learning" },
      ];
      const mockCount = 5;

      mockSupabaseClient.from.mockReturnValue({
        select: vi
          .fn()
          .mockImplementationOnce((columns) => {
            if (columns === "id,question,answer,state") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    then: vi.fn((resolve) => resolve({ data: mockFlashcards, error: null })),
                  })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: mockCount, error: null })),
                })),
              };
            }
            return {} as any;
          }),
      });

      const result = await getUserFlashcards(mockSupabaseClient as any, userId, 1, 2);

      expect(result.data).toEqual(mockFlashcards);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 3,
        totalItems: 5,
      });
      expect(mockSupabaseClient.from("flashcards").select).toHaveBeenCalledWith("id,question,answer,state");
      expect(mockSupabaseClient.from("flashcards").select).toHaveBeenCalledWith("*", { count: "exact", head: true });
    });

    it("should throw an error if fetching flashcards fails", async () => {
      const mockError = { message: "Failed to fetch flashcards" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi
          .fn()
          .mockImplementationOnce((columns) => {
            if (columns === "id,question,answer,state") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    then: vi.fn((resolve) => resolve({ data: null, error: mockError })),
                  })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 0, error: null })),
                })),
              };
            }
            return {} as any;
          }),
      });

      await expect(getUserFlashcards(mockSupabaseClient as any, userId, 1, 2)).rejects.toThrow(mockError.message);
    });

    it("should throw an error if fetching count fails", async () => {
      const mockError = { message: "Failed to fetch count" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn()
          .mockImplementationOnce((columns) => {
            if (columns === "id,question,answer,state") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    then: vi.fn((resolve) => resolve({ data: [], error: null })),
                  })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 0, error: mockError })),
                })),
              };
            }
            return {} as any;
          }),
      });

      await expect(getUserFlashcards(mockSupabaseClient as any, userId, 1, 2)).rejects.toThrow(mockError.message);
    });
  });

  describe("deleteFlashcard", () => {
    it("should delete a flashcard successfully", async () => {
      const mockEq = vi.fn().mockResolvedValueOnce({ error: null });
      const mockDelete = vi.fn(() => ({
        eq: mockEq,
      }));
      mockSupabaseClient.from.mockReturnValue({
        delete: mockDelete,
      });

      await deleteFlashcard(mockSupabaseClient as any, 1);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", 1);
    });

    it("should throw an error if flashcard deletion fails", async () => {
      const mockError = { message: "Failed to delete flashcard" };
      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValueOnce({ error: mockError }),
        })),
      });

      await expect(deleteFlashcard(mockSupabaseClient as any, 1)).rejects.toThrow(mockError.message);
    });
  });

  describe("getRandomFlashcard", () => {
    it("should return a random flashcard", async () => {
      const mockFlashcard = { id: 1, question: "Q1", answer: "A1" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn()
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 5, error: null })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "id, question, answer") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: mockFlashcard, error: null })),
                  })),
                })),
              };
            }
            return {} as any;
          }),
      });

      const result = await getRandomFlashcard(mockSupabaseClient as any, userId);
      expect(result).toEqual(mockFlashcard);
    });

    it("should throw an error if no flashcards are found", async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn()
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 0, error: null })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "id, question, answer") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
                  })),
                })),
              };
            }
            return {} as any;
          }),
      });

      await expect(getRandomFlashcard(mockSupabaseClient as any, userId)).rejects.toThrow("No flashcards found");
    });

    it("should throw an error if fetching count fails", async () => {
      const mockError = { message: "Failed to fetch count" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi
          .fn()
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 0, error: mockError })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "id, question, answer") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
                  })),
                })),
              };
            }
            return {} as any;
          }),
      });

      await expect(getRandomFlashcard(mockSupabaseClient as any, userId)).rejects.toThrow(mockError.message);
    });

    it("should throw an error if fetching random flashcard fails", async () => {
      const mockError = { message: "Failed to fetch random flashcard" };

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn()
          .mockImplementationOnce((columns) => {
            if (columns === "*") {
              return {
                eq: vi.fn(() => ({
                  then: vi.fn((resolve) => resolve({ count: 5, error: null })),
                })),
              };
            }
            return {} as any;
          })
          .mockImplementationOnce((columns) => {
            if (columns === "id, question, answer") {
              return {
                eq: vi.fn(() => ({
                  range: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: mockError })),
                  })),
                })),
              };
            }
            return {} as any;
          }),
      });

      await expect(getRandomFlashcard(mockSupabaseClient as any, userId)).rejects.toThrow(mockError.message);
    });
  });
});
