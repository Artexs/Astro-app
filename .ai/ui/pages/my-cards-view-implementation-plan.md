# View Implementation Plan: My Cards

## 1. Overview

This document outlines the implementation plan for the "My Cards" view, which serves as the main dashboard for authenticated users. This view displays a user's entire collection of saved flashcards in a responsive grid, supports infinite scrolling for large collections, and allows users to delete cards. It also handles the edge case for new users with no cards by redirecting them to the creation page.

## 2. View Routing

- **Path**: `/my-cards`
- **Accessibility**: This route must be protected and only accessible to authenticated users. Unauthenticated users attempting to access this path should be redirected to `/login`.

## 3. Component Structure

The view will be implemented as a React island within an Astro page.

```
/my-cards (Layout.astro)
  └── MyCardsView.tsx (Client-side React Component)
      ├── h1 ("My Cards")
      ├── (Conditional Rendering Logic)
      │   ├── LoadingSpinner.tsx (Shown during initial load)
      │   ├── GridContainer (div)
      │   │   ├── ManagedCard.tsx (Mapped from the cards array)
      │   │   ├── ...
      │   └── InfiniteScrollLoader.tsx (Shown if more cards are available)
      └── ConfirmationModal.tsx (Rendered conditionally for deletion)
```

## 4. Component Details

### `MyCardsView.tsx`

- **Component Description**: The root component for the view. It orchestrates data fetching, state management, and renders all child components. It will use a custom hook (`useMyCards`) to manage its complex logic.
- **Main Elements**: A `div` that acts as the main container, a `h1` for the title, a grid `div` for the cards, and conditionally rendered `LoadingSpinner`, `InfiniteScrollLoader`, and `ConfirmationModal` components.
- **Handled Interactions**:
  - Initiates data fetching on component mount.
  - Listens for the `onVisible` event from `InfiniteScrollLoader` to fetch subsequent pages.
- **Handled Validation**:
  - On initial data load, it checks if `pagination.totalItems` is 0. If so, it triggers a redirect to `/create`.
- **Types**: `MyCardsViewModel`, `FlashcardListItemDto`.
- **Props**: None.

### `ManagedCard.tsx`

- **Component Description**: A presentational component that displays a single flashcard's question and answer. It includes a control for initiating the deletion process.
- **Main Elements**: A container `div`, paragraphs for the question and answer, and a `button` with an 'X' icon for deletion.
- **Handled Interactions**:
  - `onClick` on the delete button, which calls the `onDeleteRequest` prop function passed from the parent.
- **Handled Validation**: None.
- **Types**: `FlashcardListItemDto`.
- **Props**:
  - `card: FlashcardListItemDto`
  - `onDeleteRequest: (card: FlashcardListItemDto) => void`

### `ConfirmationModal.tsx`

- **Component Description**: A reusable modal dialog to confirm destructive actions. It should be accessible, trapping focus and allowing dismissal via the Escape key.
- **Main Elements**: A modal overlay, a dialog container, a title, descriptive text, and "Confirm" and "Cancel" buttons.
- **Handled Interactions**:
  - `onClick` on the "Confirm" button, which calls the `onConfirm` prop.
  - `onClick` on the "Cancel" button or pressing the `Escape` key, which calls the `onCancel` prop.
- **Handled Validation**: None.
- **Types**: None.
- **Props**:
  - `isOpen: boolean`
  - `title: string`
  - `description: string`
  - `isProcessing: boolean`
  - `onConfirm: () => void`
  - `onCancel: () => void`

### `InfiniteScrollLoader.tsx`

- **Component Description**: A component placed at the end of the list that uses the Intersection Observer API to detect when it becomes visible in the viewport.
- **Main Elements**: A small, potentially invisible `div` that serves as the observer target. It may contain a loading spinner.
- **Handled Interactions**: When the component enters the viewport, it calls the `onVisible` prop.
- **Handled Validation**: None.
- **Types**: None.
- **Props**:
  - `onVisible: () => void`

## 5. Types

### DTOs (Data Transfer Objects from API)

```typescript
// DTO for a card in the list, from GET /api/flashcards
type FlashcardListItemDto = {
  id: number;
  question: string;
  answer: string;
  state: string; // e.g., 'new', 'learning', 'review'
};

// DTO for pagination info, from GET /api/flashcards
type PaginationDto = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};
```

### ViewModels (Client-side State)

```typescript
// Represents the complete state for the MyCardsView
interface MyCardsViewModel {
  cards: FlashcardListItemDto[];
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  isDeleting: boolean;
  cardToDelete: FlashcardListItemDto | null;
}
```

- **`cards`**: An array holding all flashcards fetched so far.
- **`page`**: The next page number to be fetched.
- **`isLoading`**: `true` if a fetch request for cards is in progress. Used to show loading indicators and prevent duplicate requests.
- **`hasMore`**: `true` if the server has more pages of cards to provide. Controls the visibility of the `InfiniteScrollLoader`.
- **`error`**: Stores any error message from API calls.
- **`isDeleting`**: `true` if a delete request is in progress. Used to show a loading state in the confirmation modal.
- **`cardToDelete`**: Holds the card object targeted for deletion. Its presence controls the visibility of the `ConfirmationModal`.

## 6. State Management

All state will be encapsulated within a custom React hook, `useMyCards`, to promote separation of concerns and reusability.

- **`useMyCards` Hook**:
  - **Responsibility**: Manages all state variables defined in `MyCardsViewModel`. It will handle fetching data, managing pagination, and processing deletions.
  - **Exposed API**:
    - `state: MyCardsViewModel`: The current state object.
    - `fetchNextPage: () => void`: A function to be called by the `InfiniteScrollLoader`.
    - `requestDelete: (card: FlashcardListItemDto) => void`: A function to initiate the deletion process.
    - `confirmDelete: () => void`: A function to execute the deletion.
    - `cancelDelete: () => void`: A function to cancel the deletion process.
  - **Internal Logic**:
    - A `useEffect` will trigger the initial data fetch on mount.
    - It will contain the `fetch` logic for both initial load and subsequent pages.
    - It will house the logic for calling the `DELETE` endpoint.

## 7. API Integration

- **Fetching Cards**:
  - **Endpoint**: `GET /api/flashcards`
  - **Request**: The hook will make a `fetch` call to `/api/flashcards?page={page}&limit=30`. The `page` number will be managed in the hook's state.
  - **Response**: The expected response is `{ data: FlashcardListItemDto[], pagination: PaginationDto }`. The hook will append `data` to the `cards` state and update `hasMore` based on the `pagination` info.
- **Deleting a Card**:
  - **Endpoint**: `DELETE /api/flashcards/{id}`
  - **Request**: When the user confirms deletion, the hook will make a `fetch` call to `/api/flashcards/${cardToDelete.id}` with the `DELETE` method.
  - **Response**: On a successful `200 OK` response, the hook will filter the deleted card out of the local `cards` state array.

## 8. User Interactions

1.  **Initial Load**: The user navigates to `/my-cards`. The `MyCardsView` mounts, showing a loading spinner while it fetches the first page of data.
2.  **Scrolling**: As the user scrolls down, the `InfiniteScrollLoader` enters the viewport, triggering a fetch for the next page. A loading spinner appears at the bottom of the list while new cards are loaded and appended to the grid.
3.  **Delete Initiation**: The user clicks the 'X' icon on a `ManagedCard`. The `requestDelete` function is called, setting the `cardToDelete` state and opening the `ConfirmationModal`.
4.  **Delete Confirmation**: The user clicks "Confirm" in the modal. The `confirmDelete` function is called, setting `isDeleting` to `true` (disabling the button) and sending the `DELETE` request. On success, the card is removed from the UI, and the modal closes.
5.  **Delete Cancellation**: The user clicks "Cancel" or presses `Escape`. The `cancelDelete` function is called, resetting `cardToDelete` to `null` and closing the modal.

## 9. Conditions and Validation

- **Empty State Redirect**:
  - **Condition**: On the initial data fetch, if the response indicates `pagination.totalItems === 0`.
  - **Component**: `useMyCards` hook.
  - **Action**: Perform a client-side redirect to `/create`.
- **End of List**:
  - **Condition**: After a fetch, if `pagination.currentPage >= pagination.totalPages`.
  - **Component**: `useMyCards` hook.
  - **Action**: Set the `hasMore` state to `false` to hide the `InfiniteScrollLoader` and prevent further fetch attempts.

## 10. Error Handling

- **Card Fetching Fails**: If a `GET` request to `/api/flashcards` fails, the `useMyCards` hook will set an error message in the `error` state. The `MyCardsView` will display this message to the user, ideally with a retry mechanism.
- **Card Deletion Fails**: If the `DELETE` request fails, the hook will catch the error. The `isDeleting` state will be reset to `false`, and an error message will be displayed to the user (e.g., inside the modal or as a toast notification), allowing them to retry the action.
- **Unauthorized Access**: If any API request returns a 401 status, a global client-side auth listener (or middleware) should intercept this and redirect the user to `/login`.

## 11. Implementation Steps

1.  **Create File Structure**:
    - Create the Astro page at `src/pages/my-cards.astro`.
    - Create the React components directory `src/components/views/my-cards/`.
    - Create the files: `MyCardsView.tsx`, `ManagedCard.tsx`, `ConfirmationModal.tsx`, `InfiniteScrollLoader.tsx`, and `useMyCards.ts`.
2.  **Develop `useMyCards` Hook**:
    - Implement the state variables and the core logic for `fetch`, `delete`, and state updates.
    - Handle the empty state redirect and `hasMore` logic.
3.  **Build React Components**:
    - Implement the four React components (`MyCardsView`, `ManagedCard`, `ConfirmationModal`, `InfiniteScrollLoader`) using Tailwind CSS for styling.
    - `MyCardsView` will integrate and use the `useMyCards` hook.
    - Ensure props are passed down correctly (e.g., `onDeleteRequest` to `ManagedCard`).
4.  **Create Astro Page**:
    - In `src/pages/my-cards.astro`, import and render the `MyCardsView.tsx` component as a client-side island (`client:load`).
    - Ensure the page uses the main `Layout.astro` and has appropriate authentication checks if they are handled at the page level.
5.  **Testing and Refinement**:
    - Manually test all user interactions: initial load, infinite scroll, delete success, delete failure, and the empty state redirect.
    - Check for responsiveness and ensure the grid adapts correctly to different screen sizes.
    - Verify accessibility of the modal.
