import React, { useState } from "react";
import { type FlashcardListItemDto } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ManagedCardProps {
  card: FlashcardListItemDto;
  onDeleteRequest: (card: FlashcardListItemDto) => void;
  showDeleteButton: boolean;
}

const ManagedCard: React.FC<ManagedCardProps> = ({ card, onDeleteRequest, showDeleteButton }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    if (!showDeleteButton) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMouseLeave = () => {
    if (!showDeleteButton) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 flex flex-col justify-between shadow-md relative
        ${!showDeleteButton ? "cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 ease-in-out" : ""}
        ${isExpanded ? "fixed inset-0 z-50 m-auto w-[90vw] h-[90vh] max-w-3xl max-h-[600px] bg-white dark:bg-gray-800 shadow-2xl border-blue-500 p-8 overflow-auto" : ""}
      `}
      onClick={handleCardClick}
      // onMouseLeave={handleMouseLeave}
      style={isExpanded ? { transform: "translate(-50%, -50%)", left: "50%", top: "50%" } : {}}
    >
      {showDeleteButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-100"
          onClick={() => onDeleteRequest(card)}
        >
          &times;
        </Button>
      )}
      <div>
        <p className="text-sm text-gray-500 mb-2">Question</p>
        <p className="font-semibold mb-4 text-lg">{card.question}</p>
      </div>
      {isExpanded && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Answer</p>
          <p className="text-base">{card.answer}</p>
        </div>
      )}
    </div>
  );
};

export default ManagedCard;
