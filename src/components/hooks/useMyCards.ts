import { useState, useEffect, useCallback } from "react";
import { type FlashcardListItemDto } from "@/lib/types";

// DTO for pagination info, from GET /api/flashcards
type PaginationDto = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

// Represents the complete state for the MyCardsView
interface MyCardsViewModel {
  cards: FlashcardListItemDto[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  isDeleting: boolean;
  cardToDelete: FlashcardListItemDto | null;
}

// Custom hook for managing the state and logic of the My Cards view
export const useMyCards = () => {
  const [state, setState] = useState<MyCardsViewModel>({
    cards: [],
    page: 1,
    isLoading: true,
    hasMore: true,
    error: null,
    isDeleting: false,
    cardToDelete: null,
  });

  const fetchNextPage = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/flashcards?page=${state.page}&limit=30`);
      console.log("test frontend: ", response);
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch cards");
      }

      const { data, pagination }: { data: FlashcardListItemDto[]; pagination: PaginationDto } = await response.json();

      // On initial load, if there are no cards, redirect to create page
      if (state.page === 1 && pagination.totalItems === 0) {
        window.location.href = "/create";
        return;
      }

      setState((prevState) => ({
        ...prevState,
        cards: [...prevState.cards, ...data],
        page: prevState.page + 1,
        hasMore: pagination.currentPage < pagination.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, [state.isLoading, state.hasMore, state.page]);

  const requestDelete = (card: FlashcardListItemDto) => {
    setState((prevState) => ({ ...prevState, cardToDelete: card }));
  };

  const cancelDelete = () => {
    setState((prevState) => ({ ...prevState, cardToDelete: null }));
  };

  const confirmDelete = async () => {
    if (!state.cardToDelete) return;

    setState((prevState) => ({ ...prevState, isDeleting: true, error: null }));

    try {
      const response = await fetch(`/api/flashcards/${state.cardToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to delete card");
      }

      setState((prevState) => ({
        ...prevState,
        cards: prevState.cards.filter((card) => card.id !== prevState.cardToDelete?.id),
        isDeleting: false,
        cardToDelete: null,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        isDeleting: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  useEffect(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return {
    state,
    fetchNextPage,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
};
