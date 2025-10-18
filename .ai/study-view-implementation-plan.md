# View Implementation Plan: Study

## 1. Overview
This document provides the implementation plan for the "Study" view. This page offers a focused, distraction-free environment for users to study their flashcards. It displays one card at a time, fetched randomly from the user's collection. Users can flip the card to see the answer and then request the next random card.

## 2. View Routing
- **Path**: `/study`
- **Accessibility**: This route is protected and only accessible to authenticated users.

## 3. Component Structure
The view will be a React island centered around the flippable card component.

```
/study (Layout.astro)
  └── StudyView.tsx (Client-side React Component)
      ├── (Conditional: isLoading) -> LoadingSpinner
      ├── (Conditional: error) -> ErrorMessage (e.g., for no cards)
      ├── (Conditional: currentCard)
      │   ├── StudyCard.tsx
      │   └── button ("Next Card")
```

## 4. Component Details

### `StudyView.tsx`
- **Component Description**: The main component for the study session. It is responsible for fetching a random flashcard from the API and managing the overall state of the view, such as loading and error conditions.
- **Main Elements**: Conditionally renders a loading spinner, an error message, or the `StudyCard` and a "Next Card" button.
- **Handled Interactions**:
    - Fetches the first random card on component mount.
    - `onClick` on the "Next Card" button triggers a fetch for a new random card.
- **Handled Validation**:
    - Checks for a "No flashcards found" error from the API to display a specific empty state message.
- **Types**: `StudyFlashcardDto`, `StudyViewModel`.
- **Props**: None.

### `StudyCard.tsx`
- **Component Description**: A component representing a single, flippable flashcard. It has a front (question) and a back (answer) and manages its own flipped state.
- **Main Elements**: A container with perspective for the 3D flip effect. Two child `div`s for the front and back faces of the card.
- **Handled Interactions**:
    - `onClick` on the card toggles its `isFlipped` state, triggering a CSS transition/animation.
- **Handled Validation**: None.
- **Types**: `StudyFlashcardDto`.
- **Props**:
    - `card: StudyFlashcardDto`

## 5. Types

### DTOs (Data Transfer Objects)
```typescript
// DTO for a flashcard presented during a study session
// from GET /api/flashcards/study/random
type StudyFlashcardDto = {
  id: number;
  question: string;
  answer: string;
};
```

### ViewModels (Client-side State)
```typescript
// Represents the complete state for the StudyView
interface StudyViewModel {
  currentCard: StudyFlashcardDto | null;
  isLoading: boolean;
  error: string | null;
}
```
- **`currentCard`**: Holds the flashcard object currently being displayed.
- **`isLoading`**: `true` when an API request to fetch a random card is in flight.
- **`error`**: Stores any error message from the API, especially the "No flashcards found" case.

## 6. State Management
A custom hook, `useStudyView`, will manage the view's state and logic.

- **`useStudyView` Hook**:
    - **Responsibility**: Manages the `currentCard`, `isLoading`, and `error` states. It contains the logic to fetch a random card from the API.
    - **Exposed API**:
        - `state: StudyViewModel`
        - `fetchRandomCard: () => void`
    - **Internal Logic**:
        - A `useEffect` on mount will call `fetchRandomCard` to load the initial card.
        - The `fetchRandomCard` function will handle the API call, setting `isLoading` before the request and processing the response (populating `currentCard` or `error`).

## 7. API Integration
- **Fetching a Random Card**:
    - **Endpoint**: `GET /api/flashcards/study/random`
    - **Action**: Triggered on initial component load and on every click of the "Next Card" button.
    - **Request**: A `fetch` call with no body.
    - **Response**: On success, the response is `{ data: StudyFlashcardDto }`. On failure (e.g., no cards), the API returns a 404 with an error message.

## 8. User Interactions
1.  **Initial Load**: The user navigates to `/study`. The `StudyView` mounts, shows a loading spinner, and fetches the first random card.
2.  **Card Loaded**: The spinner is replaced by the `StudyCard` (showing the question) and the "Next Card" button.
3.  **Flipping the Card**: The user clicks on the `StudyCard`. The card flips over with a smooth animation to reveal the answer.
4.  **Requesting Next Card**: The user clicks the "Next Card" button. The `StudyCard` is replaced by a loading spinner while a new random card is fetched. The process repeats from step 2.

## 9. Conditions and Validation
- **No Cards to Study**:
    - **Condition**: The API at `GET /api/flashcards/study/random` returns a 404 Not Found status.
    - **Component**: `useStudyView` hook.
    - **Action**: The hook will set an `error` state. The `StudyView` will detect this specific error and render a user-friendly message like "You have no cards to study. Create some first!" with a navigation link to `/create`.

## 10. Error Handling
- **404 Not Found**: Handled as a specific UI state (see above), not as a generic error.
- **500 Internal Server Error**: If the API fails for other reasons, a generic error message "Could not load a card. Please try again." should be displayed.
- **Network Error**: If the `fetch` call fails, a network error message should be shown.

## 11. Implementation Steps
1.  **Create Files**: Create `src/pages/study.astro` and the React components under `src/components/views/study/`: `StudyView.tsx` and `StudyCard.tsx`.
2.  **Develop `useStudyView` Hook**: Implement the state and the `fetchRandomCard` function to call the `GET /api/flashcards/study/random` endpoint, handling loading, success, and error states.
3.  **Build `StudyCard` Component**: Implement the flippable card UI. This will involve CSS for the 3D transform, perspective, and transitions. The component will have an internal `isFlipped` state.
4.  **Build `StudyView` Component**: Use the `useStudyView` hook. Implement the conditional rendering for loading, error, and the main card display. Connect the "Next Card" button to the `fetchRandomCard` function.
5.  **Integrate in Astro**: In `study.astro`, render the `StudyView` component as a client-side island (`client:load`).
6.  **Test**: Manually test the study flow. Verify that a card loads, it flips on click, the "Next Card" button works, and the empty state (no cards) is handled correctly.
