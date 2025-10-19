import { Button } from "@/components/ui/button";

interface ReviewCompletionProps {
  acceptedCount: number;
}

const ReviewCompletion = ({ acceptedCount }: ReviewCompletionProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Review Complete!</h2>
      <p className="mb-4">You added {acceptedCount} new cards to your collection!</p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <a href="/study">Study</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/create">Create More</a>
        </Button>
      </div>
    </div>
  );
};

export default ReviewCompletion;
