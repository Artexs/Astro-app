# UI Architecture for AI Flashcard Generator

## 1. UI Structure Overview

The application will be a Multi-Page Application (MPA) built with Astro, where each primary feature corresponds to a distinct page (`/create`, `/my-cards`, `/study`). Interactive, stateful UI sections within these pages (e.g., the card generation form, the review grid, the study card) will be implemented as client-side React components, following Astro's "islands of interactivity" architecture.

Authentication state will be managed globally on the client-side using the Supabase JS library, with the resulting JWT being attached to all API requests. Data fetching will occur on the client-side within the React components, which will call the backend Astro API routes. A persistent, top-level navigation bar will provide consistent navigation across all views for authenticated users.

## 2. View List

### Authentication Views

- **Login View**
  - **View Path**: `/login`
  - **Main Purpose**: To authenticate existing users.
  - **Key Information**: Email and password fields.
  - **Key View Components**: `LoginForm`, `Input`, `Button`, links to Sign-up and Forgot Password.
  - **UX, Accessibility, and Security**: Standard form validation with clear error messages. All inputs will have ARIA labels. Communication is secured via HTTPS.

- **Sign-up View**
  - **View Path**: `/signup`
  - **Main Purpose**: To register new users.
  - **Key Information**: Email and password fields.
  - **Key View Components**: `SignupForm`, `Input`, `Button`, link to Login.
  - **UX, Accessibility, and Security**: Informs the user that a verification email will be sent. Includes a password strength indicator.

- **Forgot Password View**
  - **View Path**: `/forgot-password`
  - **Main Purpose**: To allow users to initiate a password reset.
  - **Key Information**: Email field.
  - **Key View Components**: `ForgotPasswordForm`, `Input`, `Button`.
  - **UX, Accessibility, and Security**: Provides a clear confirmation message upon submission, instructing the user to check their email.

### Core Application Views

- **Create View**
  - **View Path**: `/create`
  - **Main Purpose**: To allow users to input text for flashcard generation (maps to `US-008`).
  - **Key Information**: A large text area for user input.
  - **Key View Components**: `WordCountValidator`, `GenerationLoadingOverlay`.
  - **UX, Accessibility, and Security**:
    - **UX**: Provides real-time word count feedback. The "Generate" button is disabled until the input text is within the 1,000-10,000 word range. A loading overlay with dynamic progress text is shown during generation (`US-009`).
    - **Accessibility**: The text area and button have proper labels. The loading overlay is accessible, traps focus, and announces its status to screen readers.
    - **Security**: While client-side validation provides a good UX, the word count is re-validated on the server (`POST /api/flashcards/generate`).

- **Review View**
  - **View Path**: `/review` (This is a transient view, not directly navigable, presented after generation).
  - **Main Purpose**: To allow users to review, accept, or reject AI-generated flashcards (`US-010`).
  - **Key Information**: A grid of generated flashcards, each with a question and answer.
  - **Key View Components**: `ReviewableCard`, `ReviewCompletion`.
  - **UX, Accessibility, and Security**:
    - **UX**: Cards are displayed in a 3-column grid with infinite scroll. Clicking "Reject" makes the card disappear (`US-011`). Clicking "Accept" saves the card and removes it from the queue (`US-012`). After the last card, a completion summary is shown (`US-013`).
    - **Accessibility**: "Accept" and "Reject" buttons have clear, accessible labels. The grid is responsive.
    - **Security**: The "Accept" action triggers an authenticated API call (`POST /api/flashcards`).

- **My Cards View**
  - **View Path**: `/my-cards` (Serves as the main dashboard for logged-in users).
  - **Main Purpose**: To display all of the user's accepted flashcards (`US-014`).
  - **Key Information**: A grid of the user's flashcards.
  - **Key View Components**: `ManagedCard`, `ConfirmationModal`, `InfiniteScrollLoader`.
  - **UX, Accessibility, and Security**:
    - **UX**: Displays cards in a 3-column grid with infinite scroll. New users with no cards are automatically redirected to the `/create` page (`US-015`). Deleting a card requires confirmation via a modal (`US-016`).
    - **Accessibility**: The delete button on each card has an accessible name (e.g., "Delete card: [card question]"). The confirmation modal traps focus.
    - **Security**: Data is fetched and deleted via authenticated API calls (`GET /api/flashcards`, `DELETE /api/flashcards/{id}`).

- **Study View**
  - **View Path**: `/study`
  - **Main Purpose**: To provide a focused, distraction-free environment for studying flashcards (`US-017`).
  - **Key Information**: A single flashcard, showing the front (question) by default.
  - **Key View Components**: `StudyCard`, "Next Card" `Button`.
  - **UX, Accessibility, and Security**:
    - **UX**: Minimalist UI. The user can click the card to flip it and reveal the answer. The "Next Card" button fetches a new, randomly selected card (`US-018`).
    - **Accessibility**: The card flip action is announced to screen readers. Card content is highly readable.
    - **Security**: Cards are fetched one by one via an authenticated API call (`GET /api/flashcards/study/random`).

- **Account View**
  - **View Path**: `/account`
  - **Main Purpose**: To allow users to manage their password and account (`US-006`, `US-007`).
  - **Key Information**: Forms for changing password and deleting the account.
  - **Key View Components**: `ChangePasswordForm`, `DeleteAccountForm`.
  - **UX, Accessibility, and Security**:
    - **UX**: The "Delete Account" action is a destructive operation and is protected by a confirmation step requiring the user to re-enter their password.
    - **Accessibility**: All form fields and buttons are clearly labeled.
    - **Security**: All actions are performed via authenticated API calls. Account deletion is a critical, secure backend operation.

## 3. User Journey Map

1.  **New User Onboarding & First Use Case**:
    1.  A new user signs up at `/signup` and verifies their email.
    2.  They log in at `/login` and are redirected to `/my-cards`.
    3.  Because their collection is empty, the app automatically redirects them to `/create`.
    4.  The user pastes text (1k-10k words) and clicks "Generate."
    5.  A loading overlay appears while the client calls `POST /api/flashcards/generate`.
    6.  Upon success, the view transitions to `/review`, displaying the generated cards.
    7.  The user reviews each card, clicking "Accept" (which calls `POST /api/flashcards`) or "Reject."
    8.  After the final card is reviewed, a completion message appears with options to "Study" or "Create" more.
    9.  The user can now navigate to `/my-cards` to see their saved collection or `/study` to begin practicing.

2.  **Returning User Flow**:
    1.  A returning user logs in and is directed to `/my-cards`.
    2.  Their existing flashcards are displayed in a grid, and they can load more by scrolling down (`GET /api/flashcards` with pagination).
    3.  From the navigation bar, they can go to `/create` to generate new cards or `/study` to practice their existing ones.
    4.  On the `/my-cards` view, they can delete a card, which requires confirmation.

## 4. Layout and Navigation Structure

- **Layout**: A single, primary Astro layout (`src/layouts/Layout.astro`) will wrap all pages. This component will contain the header with the navigation bar, a main content area for the page-specific components, and a footer.
- **Navigation Bar**:
  - **Authenticated Users**: A persistent navigation bar at the top of the page will contain links to:
    - `Create` (`/create`)
    - `My Cards` (`/my-cards`)
    - `Study` (`/study`)
    - A user menu with links to `Account` (`/account`) and a `Logout` button.
  - **Unauthenticated Users**: The navigation will be simpler, showing links for `Login` and `Sign Up`.

## 5. Key Components

These are reusable React components that will form the building blocks of the UI.

- **`Button`**: A general-purpose, styled button for consistent interactions.
- **`Input`**: A general-purpose, styled text input field for forms.
- **`ConfirmationModal`**: A modal dialog to confirm destructive actions (e.g., "Are you sure you want to delete this card?"). It will trap focus and be accessible.
- **`InfiniteScrollLoader`**: A component that detects when the user has scrolled to the bottom of a list and triggers a function to load more data. Used in `My Cards` and `Review` views.
- **`LoadingOverlay`**: A full-screen overlay with a message, used during the synchronous flashcard generation process.
- **`Flashcard` (Base Component)**: A simple, non-interactive component to display a question and an answer. This will be extended by more specific card components.
- **`ReviewableCard`**: Extends `Flashcard`. Adds "Accept" and "Reject" buttons and is used in the `Review View`.
- **`ManagedCard`**: Extends `Flashcard`. Adds a "Delete" button and is used in the `My Cards View`.
- **`StudyCard`**: A flippable card component used in the `Study View`. The front displays the question, and the back (revealed on click) displays the answer.
