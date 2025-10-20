import React, { useState } from "react";
import { useMyCards } from "@/components/hooks/useMyCards";
import ManagedCard from "./ManagedCard";
import InfiniteScrollLoader from "./InfiniteScrollLoader";
import ConfirmationModal from "./ConfirmationModal";
import { Button } from "@/components/ui/button";

// Placeholder for a loading spinner component
const LoadingSpinner = () => <div className="text-center p-4">Loading...</div>;

const MyCardsView: React.FC = () => {
  const { state, fetchNextPage, requestDelete, confirmDelete, cancelDelete } = useMyCards();
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  if (state.isLoading && state.cards.length === 0) {
    return <LoadingSpinner />;
  }

  if (state.error && !state.cardToDelete) {
    return <div className="text-red-500 text-center p-4">Error: {state.error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">My Cards</h1>
        <Button variant={isDeleteMode ? "destructive" : "outline"} onClick={() => setIsDeleteMode(!isDeleteMode)}>
          {isDeleteMode ? "Exit Delete Mode" : "Delete Cards"}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.cards.map((card) => (
          <ManagedCard key={card.id} card={card} onDeleteRequest={requestDelete} showDeleteButton={isDeleteMode} />
        ))}
      </div>
      {state.hasMore && <InfiniteScrollLoader onVisible={fetchNextPage} />}
      {state.isLoading && state.cards.length > 0 && <LoadingSpinner />}
      <ConfirmationModal
        isOpen={!!state.cardToDelete}
        title="Are you sure?"
        description={`Do you really want to delete the card: "${state.cardToDelete?.question}"? This action cannot be undone.`}
        isProcessing={state.isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default MyCardsView;
