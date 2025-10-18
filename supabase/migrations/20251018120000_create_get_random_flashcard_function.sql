CREATE OR REPLACE FUNCTION get_random_flashcard(p_user_id uuid)
RETURNS TABLE (
  id bigint,
  question text,
  answer text
) AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.question, f.answer
  FROM flashcards f
  WHERE f.user_id = p_user_id
  ORDER BY random()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;