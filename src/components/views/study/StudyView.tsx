import { useStudyView } from "@/components/hooks/useStudyView";
import StudyCard from "@/components/views/study/StudyCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const StudyView = () => {
  const { state, fetchRandomCard } = useStudyView();
  const { currentCard, isLoading, error } = state;

  return (
    <div className="py-8 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-gradient">Study Session</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-80">
          {/* Using a simple text spinner, can be replaced with a component */}
          <p className="text-lg animate-pulse">Loading card...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="h-80 flex flex-col justify-center">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col items-center gap-4">
            {error}
            {error.includes("no cards") && (
              <Button asChild variant="outline">
                <a href="/create">Create a Card</a>
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && currentCard && <StudyCard card={currentCard} />}

      <div className="w-full flex justify-center">
        <Button onClick={fetchRandomCard} disabled={isLoading} className="w-full md:w-auto" size="lg">
          Next Card
        </Button>
      </div>
    </div>
  );
};

export default StudyView;
