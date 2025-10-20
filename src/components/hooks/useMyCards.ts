import { useState, useEffect, useCallback, useRef } from "react";
import { type FlashcardListItemDto } from "@/lib/types";

// DTO for pagination info, from GET /api/flashcards
interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

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

  // Use a ref to track if the initial fetch has been performed
  const initialFetchDone = useRef(false);

  const fetchCards = useCallback(async (pageToFetch: number) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/flashcards?page=${pageToFetch}&limit=30`);
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch cards");
      }

      const { data, pagination }: { data: FlashcardListItemDto[]; pagination: PaginationDto } = await response.json();

      // If it's the very first page and no items, redirect
      if (pageToFetch === 1 && pagination.totalItems === 0) {
        window.location.href = "/create";
        return;
      }

      setState((prevState) => ({
        ...prevState,
        cards: pageToFetch === 1 ? data : [...prevState.cards, ...data],
        page: pageToFetch + 1,
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
  }, []); // No dependencies here, as it takes `pageToFetch` as an argument

  // Effect for initial data fetch
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchCards(1); // Fetch the first page on mount
    }
  }, [fetchCards]); // `fetchCards` is stable due to empty dependency array in its useCallback

  // Function to be called by InfiniteScrollLoader
  const fetchNextPage = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      fetchCards(state.page);
    }
  }, [state.isLoading, state.hasMore, state.page, fetchCards]);

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

  return {
    state,
    fetchNextPage, // This is the one passed to InfiniteScrollLoader
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
};
