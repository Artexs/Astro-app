import React from "react";

interface WordCountValidatorProps {
  wordCount: number;
  min: number;
  max: number;
}

const WordCountValidator: React.FC<WordCountValidatorProps> = ({ wordCount, min, max }) => {
  const isValid = wordCount >= min && wordCount <= max;

  return (
    <p className={`text-sm ${isValid ? "text-gray-500" : "text-red-500"}`}>
      Word count: {wordCount} (required: {min}-{max})
    </p>
  );
};

export default WordCountValidator;
