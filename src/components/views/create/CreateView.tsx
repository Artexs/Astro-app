import React, { useState, useMemo } from "react";
import WordCountValidator from "./WordCountValidator";
import GenerationLoadingOverlay from "./GenerationLoadingOverlay";
import { Button } from "@/components/ui/button";

const CreateView: React.FC = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const isValid = useMemo(() => wordCount >= 1000 && wordCount <= 10000, [wordCount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate flashcards. Please try again later.");
      }

      sessionStorage.setItem("generatedFlashcards", JSON.stringify(result.data));
      window.location.href = "/review";
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "A network error occurred. Please check your connection and try again.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4 text-gradient">Create Flashcards</h1>
      <p className="text-lg text-gray-600 mb-8">
        Paste your text below (between 1,000 and 10,000 words) to generate flashcards.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your text here..."
        />
        <div className="flex justify-between items-center mt-4">
          <WordCountValidator wordCount={wordCount} min={1000} max={10000} />
          <Button type="submit" disabled={!isValid || isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <GenerationLoadingOverlay isOpen={isLoading} />
    </div>
  );
};

export default CreateView;
