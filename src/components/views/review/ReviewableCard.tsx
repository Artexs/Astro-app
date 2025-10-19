import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GeneratedFlashcardDto {
  question: string;
  answer: string;
}

interface ReviewableCardProps {
  card: GeneratedFlashcardDto;
  onAccept: (card: GeneratedFlashcardDto) => void;
  onReject: (card: GeneratedFlashcardDto) => void;
  isSaving: boolean;
}

const ReviewableCard = ({ card, onAccept, onReject, isSaving }: ReviewableCardProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleReject = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onReject(card);
    }, 300); // Match the duration of the fade-out animation
  };

  return (
    <div
      className={`border p-4 rounded-lg shadow-md transition-opacity duration-300 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-semibold">{card.question}</p>
      <p>{card.answer}</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleReject} disabled={isSaving || isFadingOut}>
          Reject
        </Button>
        <Button onClick={() => onAccept(card)} disabled={isSaving || isFadingOut}>
          {isSaving ? "Saving..." : "Accept"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewableCard;
