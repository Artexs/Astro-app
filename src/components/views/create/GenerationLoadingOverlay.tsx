import React from "react";

interface GenerationLoadingOverlayProps {
  isOpen: boolean;
}

const GenerationLoadingOverlay: React.FC<GenerationLoadingOverlayProps> = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700" aria-live="polite">
          Generating your flashcards...
        </p>
      </div>
    </div>
  );
};

export default GenerationLoadingOverlay;
