import React from "react";
import { type FlashcardListItemDto } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ManagedCardProps {
  card: FlashcardListItemDto;
  onDeleteRequest: (card: FlashcardListItemDto) => void;
}

const ManagedCard: React.FC<ManagedCardProps> = ({ card, onDeleteRequest }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between shadow-md relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onDeleteRequest(card)}
      >
        &times;
      </Button>
      <div>
        <p className="text-sm text-gray-500 mb-2">Question</p>
        <p className="font-semibold mb-4">{card.question}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Answer</p>
        <p>{card.answer}</p>
      </div>
    </div>
  );
};

export default ManagedCard;
