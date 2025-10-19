import { useState, useEffect, useCallback } from "react";
import type { StudyFlashcardDto } from "@/lib/types";

interface StudyViewModel {
  currentCard: StudyFlashcardDto | null;
  isLoading: boolean;
  error: string | null;
}

export const useStudyView = () => {
  const [state, setState] = useState<StudyViewModel>({
    currentCard: null,
    isLoading: true,
    error: null,
  });

  const fetchRandomCard = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await fetch("/api/flashcards/study/random");

      if (response.status === 404) {
        setState({
          currentCard: null,
          isLoading: false,
          error: "You have no cards to study. Create some first!",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load a card. Please try again.");
      }

      const { data }: { data: StudyFlashcardDto } = await response.json();
      setState({ currentCard: data, isLoading: false, error: null });
    } catch (e) {
      const error =
        e instanceof Error ? e.message : "An unexpected error occurred.";
      setState({ currentCard: null, isLoading: false, error });
    }
  }, []);

  useEffect(() => {
    fetchRandomCard();
  }, [fetchRandomCard]);

  return { state, fetchRandomCard };
};