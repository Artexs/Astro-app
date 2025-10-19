import { useReviewView } from "@/components/hooks/useReviewView";
import ReviewableCard from "@/components/views/review/ReviewableCard";
import ReviewCompletion from "@/components/views/review/ReviewCompletion";

const ReviewView = () => {
  const { state, handleAccept, handleReject } = useReviewView();

  if (state.cardsToReview.length === 0) {
    return <ReviewCompletion acceptedCount={state.acceptedCount} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gradient">Review Generated Cards</h1>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.cardsToReview.map((card, index) => (
          <ReviewableCard
            key={index}
            card={card}
            onAccept={handleAccept}
            onReject={handleReject}
            isSaving={state.isSaving[card.question] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewView;
