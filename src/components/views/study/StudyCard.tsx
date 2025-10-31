import { useState } from "react";
import type { StudyFlashcardDto } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudyCardProps {
  card: StudyFlashcardDto;
}

// A flippable card component for studying.
const StudyCard = ({ card }: StudyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="w-full h-80 perspective-1000"
      onClick={handleCardFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardFlip();
        }
      }}
    >
      <div
        className={cn("relative w-full h-full transition-transform duration-700 preserve-3d", {
          "rotate-y-180": isFlipped,
        })}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Card className="flex items-center justify-center w-full h-full flashcard-background">
            <CardContent className="p-6 text-xl text-center">
              <p>{card.question}</p>
            </CardContent>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden">
          <Card className="flex items-center justify-center w-full h-full flashcard-background">
            <CardContent className="p-6 text-xl text-center">
              <p>{card.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
