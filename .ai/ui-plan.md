# UI Architecture for AI Flashcard Generator

## 1. UI Structure Overview

The UI architecture is designed around a clear, task-oriented user flow, separating the application into distinct zones for unauthenticated and authenticated users. For unauthenticated users, the focus is on product discovery and conversion through sign-up. For authenticated users, the structure is built around three core activities: creating flashcards, managing them, and studying.

The design prioritizes a clean, minimalist interface to keep the user focused on the task at hand, whether it's inputting text, reviewing generated cards, or studying. Navigation is straightforward, and the user journey is designed to guide new users from their first login directly to the core value proposition of the app: flashcard creation.

## 2. View List

### Public & Authentication Views

-   **View:** Landing Page
    -   **Path:** `/`
    -   **Main Purpose:** Introduce the product to new users and serve as the main entry point for login or registration.
    -   **Key Information:** Product value proposition, key features, and prominent calls-to-action.
    -   **Key Components:** Marketing hero section, "Sign Up" button, "Login" link.
    -   **Considerations:** This page should be statically generated for optimal performance and SEO.

-   **View:** Sign-Up
    -   **Path:** `/signup`
    -   **Main Purpose:** Allow new users to create an account.
    -   **Key Information:** Email and password input fields.
    -   **Key Components:** Sign-up form, link to login page.
    -   **Considerations:**
        -   **UX:** Provide real-time validation for email format and password strength.
        -   **Security:** Use POST for form submission. Ensure password fields are of `type="password"`.

-   **View:** Login
    -   **Path:** `/login`
    -   **Main Purpose:** Authenticate existing users.
    -   **Key Information:** Email and password input fields.
    -   **Key Components:** Login form, "Forgot Password?" link.
    -   **Considerations:**
        -   **UX:** On successful login, redirect users to their "My Cards" dashboard.
        -   **Accessibility:** Ensure all form fields have associated labels.

-   **View:** Forgot Password
    -   **Path:** `/forgot-password`
    -   **Main Purpose:** Allow users to initiate the password reset process.
    -   **Key Information:** Email input field.
    -   **Key Components:** Form to submit email.
    -   **Considerations:** Display a confirmation message instructing the user to check their email.

-   **View:** Reset Password
    -   **Path:** `/reset-password`
    -   **Main Purpose:** Allow users to set a new password using a token from their email.
    -   **Key Information:** New password and confirmation fields.
    -   **Key Components:** Password reset form.
    -   **Considerations:** The URL for this page will contain a unique token from the password reset email.

### Authenticated Core Views

-   **View:** Create
    -   **Path:** `/create`
    -   **Main Purpose:** Provide the interface for users to input text for flashcard generation.
    -   **Key Information:** Large text area for content input.
    -   **Key Components:** Text area, real-time word count display, "Generate" button.
    -   **Considerations:**
        -   **UX:** The "Generate" button should be disabled (`aria-disabled="true"`) until the word count is within the required range (1,000-10,000 words).
        -   **Accessibility:** The word count and validation messages should be linked to the text area using `aria-describedby`.

-   **View:** Generation Loading
    -   **Path:** (Modal or overlay on `/create`)
    -   **Main Purpose:** Provide feedback that the AI is processing the text.
    -   **Key Information:** Dynamic status text (e.g., "Analyzing text...", "Generating cards...").
    -   **Key Components:** Loading spinner/animation, status text container.
    -   **Considerations:**
        -   **Accessibility:** The status text should be in an ARIA live region (`aria-live="polite"`) to be announced by screen readers.

-   **View:** Review
    -   **Path:** `/review`
    -   **Main Purpose:** Allow users to approve or reject the AI-generated flashcards.
    -   **Key Information:** A collection of potential flashcards, each showing a question and answer.
    -   **Key Components:** 3-column grid of `ReviewableCard` components, "Accept" and "Reject" buttons on each card.
    -   **Considerations:**
        -   **UX:** Clicking "Accept" or "Reject" should provide immediate visual feedback (e.g., color change, fade out) and remove the card from the review queue.
        -   **API:** "Accept" triggers `POST /api/flashcards`. "Reject" simply dismisses the card on the client-side.

-   **View:** My Cards (Dashboard)
    -   **Path:** `/my-cards`
    -   **Main Purpose:** Display and manage all of the user's saved flashcards.
    -   **Key Information:** A grid of all accepted flashcards.
    -   **Key Components:** 3-column grid of `ManagedCard` components, delete icon on each card, infinite scroll mechanism.
    -   **Considerations:**
        -   **UX:** Implement infinite scroll by fetching paginated data from `GET /api/flashcards` when the user scrolls near the bottom.
        -   **Error Handling:** If a new user with no cards lands here, they are redirected to the `/create` page.

-   **View:** Study
    -   **Path:** `/study`
    -   **Main Purpose:** Provide a focused, distraction-free environment for studying flashcards.
    -   **Key Information:** A single flashcard (question and answer).
    -   **Key Components:** A flippable `StudyCard` component, "Next Card" button.
    -   **Considerations:**
        -   **UX:** The card should flip with a smooth animation on click.
        -   **API:** The view is populated by `GET /api/flashcards/study/random`.
        -   **Error Handling:** If the user has no cards, display a message and a link to the `/create` page.

-   **View:** Account
    -   **Path:** `/account`
    -   **Main Purpose:** Allow users to manage their account settings.
    -   **Key Information:** Password change form, account deletion option.
    -   **Key Components:** "Change Password" form, "Delete Account" button.
    -   **Considerations:**
        -   **Security:** The "Delete Account" action must be protected by a confirmation modal that requires the user to type their password or a specific word to proceed, preventing accidental deletion.

## 3. User Journey Map

1.  **Onboarding:** A new user lands on the **Landing Page**, clicks "Sign Up," and is taken to the **Sign-Up View**. After submitting their credentials, they verify their email and log in via the **Login View**.
2.  **First Experience:** Upon first login, the user is redirected from the empty **My Cards View** to the **Create View**.
3.  **Creation Flow:** The user pastes text and clicks "Generate." The **Generation Loading View** is shown.
4.  **Review Flow:** The user is automatically navigated to the **Review View** to vet the generated cards. They accept or reject each one.
5.  **Post-Review:** After the last card is reviewed, a success message appears with options to either go to the **Study View** or back to the **Create View**.
6.  **Study Flow:** If the user chooses to study, they enter the **Study View**, where they can flip through random cards from their collection.
7.  **Management Flow:** At any time, the user can navigate to the **My Cards View** to see their entire collection, scroll through it, and delete cards they no longer need.
8.  **Account Management:** The user can navigate to the **Account View** from the main navigation to change their password or delete their account.

## 4. Layout and Navigation Structure

-   **Main Layout:** A persistent layout component will wrap all authenticated views. It contains the main header and a content area for the active view.
-   **Header (Authenticated):**
    -   Contains the application logo and primary navigation links: "Create," "My Cards," and "Study."
    -   A user dropdown menu on the right provides access to the "Account" page and a "Logout" button.
-   **Header (Unauthenticated):**
    -   Simpler version with the logo and links to "Login" and "Sign Up."
-   **Routing:**
    -   Public routes (`/`, `/login`, `/signup`, etc.) are accessible to everyone.
    -   Authenticated routes (`/create`, `/my-cards`, etc.) are protected. Unauthenticated users attempting to access them will be redirected to the `/login` page.

## 5. Key Components

-   **`ReviewableCard`:** A component used in the **Review View**. It displays both the question and answer text and includes "Accept" and "Reject" buttons.
-   **`ManagedCard`:** A component for the **My Cards View**. It displays the card's question and includes a delete icon/button that triggers a confirmation modal.
-   **`StudyCard`:** A component for the **Study View**. It has two faces (front/question, back/answer) and flips on user interaction (e.g., a click).
-   **Confirmation Modal:** A reusable modal component used for critical actions like deleting a card or deleting an account. It must trap focus and be dismissible via the Escape key for accessibility.
-   **Infinite Scroll Loader:** A component that uses the Intersection Observer API to detect when it's visible on screen and trigger a function to load the next page of data. Used in the **My Cards View**.
