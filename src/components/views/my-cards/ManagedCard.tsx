import React, { useState, useEffect } from "react";
import { type FlashcardListItemDto } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ManagedCardProps {
  card: FlashcardListItemDto;
  onDeleteRequest: (card: FlashcardListItemDto) => void;
  showDeleteButton: boolean;
}

const ManagedCard: React.FC<ManagedCardProps> = ({ card, onDeleteRequest, showDeleteButton }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility for animation

  useEffect(() => {
    if (isExpanded) {
      setShowModal(true); // Show modal immediately
    } else {
      // Hide modal after animation completes
      const timer = setTimeout(() => setShowModal(false), 0); // 300ms matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleCardClick = () => {
    if (!showDeleteButton && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showDeleteButton) {
      setIsExpanded(false);
    }
  };

  // Render the non-expanded card
  if (!showModal) {
    return (
      <div
        className={`border rounded-lg p-4 flex flex-col justify-between shadow-md relative
          ${!showDeleteButton ? "cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 ease-in-out" : ""}
        `}
        onClick={handleCardClick}
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
      </div>
    );
  }

  // Render the expanded card with animation
  return (
    <div
      className={`border rounded-lg p-4 flex flex-col justify-between shadow-md relative
        fixed inset-0 z-50 m-auto w-[400px] h-[250px] bg-white dark:bg-gray-800 shadow-2xl border-blue-500 p-8 overflow-auto transform-origin-center transition-all duration-300 ease-out
        ${isExpanded ? "scale-100 opacity-100" : "scale-50 opacity-0"}
      `}
      onMouseLeave={handleMouseLeave}
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
        <p className="text-sm text-gray-500 mb-2">Answer</p>
        <p className="font-semibold mb-4 text-lg">{card.answer}</p>
      </div>
    </div>
  );
};

export default ManagedCard;
