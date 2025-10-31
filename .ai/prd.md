# Product Requirements Document (PRD) - AI Flashcard Generator

## 1. Product Overview

This document outlines the requirements for an AI-powered web application that automatically generates flashcards from user-provided text. The application will handle user authentication, allow users to input large blocks of text, use an AI service to create question-and-answer flashcards, and provide a platform for users to review, manage, and study these cards. The goal is to create a seamless experience for users who want to quickly create study materials from existing notes, articles, or documents without manual effort.

## 2. User Problem

Students and lifelong learners often have large volumes of text (e.g., lecture notes, articles, textbook chapters) that they need to convert into effective study materials. The process of manually creating flashcards is time-consuming, tedious, and can be a significant barrier to efficient learning. Users need a tool that can automate the creation of high-quality, relevant flashcards, allowing them to spend more time studying and less time on preparation.

## 3. Functional Requirements

### 3.1. User Authentication & Account Management

- **Authentication Provider**: All authentication will be handled by Supabase Auth.
- **Sign-Up**: Users must be able to sign up using an email and password. A verification email will be sent, which the user must click to activate their account.
- **Login/Logout**: Registered users can log in and log out.
- **Password Reset**: A "Forgot Password" flow must be available for users to reset their password via an email link.
- **Account Page**: A dedicated, authenticated `/account` page will allow users to change their password and permanently delete their account.
- **Account Deletion**: Deleting an account is a permanent action that must be confirmed by the user. It will trigger a secure backend process to remove the user from `auth.users` and a cascading delete of all their associated data (flashcards) from the database.

### 3.2. Flashcard Generation (`/create`)

- **Input**: Authenticated users can access a "Create" page with a large text area.
- **Validation**: The user must input text between 1,000 and 10,000 words. This is validated on the client-side for immediate feedback and re-validated on the server. The "Generate" button is disabled until the client-side validation passes.
- **Process**: The generation process is synchronous. When the user submits the text, a `POST` request is sent to a secure backend API endpoint (`/api/flashcards/generate`). A loading screen is displayed to the user.
- **Output**: The AI service generates a list of potential flashcards (question/answer pairs). These cards are **not** saved to the database at this stage. They are returned to the client to be passed to the Review screen.

### 3.3. Flashcard Review (`/review`)

- **Presentation**: After generation, the user is immediately redirected to a review screen displaying the newly generated cards.
- **Actions**: Each card has an "Accept" and a "Reject" button.
  - **Reject**: Rejecting a card discards it. It is removed from the review queue on the client-side and is never saved.
  - **Accept**: Accepting a card triggers a `POST` request to the `/api/flashcards` endpoint, which saves the card to the user's collection in the database. The card is then removed from the review queue.
- **Completion**: After the last card is reviewed, a summary screen appears, showing the number of cards added to the collection and providing navigation options to "Study" or "Create" more.

### 3.4. Card Management (`/my-cards`)

- **Dashboard**: The main dashboard for a logged-in user is the "My Cards" page.
- **Display**: It displays all of the user's accepted flashcards in a responsive 3-column grid.
- **Infinite Scroll**: If a user has many cards, they are loaded progressively via pagination as the user scrolls. This is powered by `GET /api/flashcards`.
- **Deletion**: Users can delete a card from this view via an 'X' icon. A confirmation modal will appear to prevent accidental deletion. This action calls the `DELETE /api/flashcards/{id}` endpoint.
- **Empty State**: If a new user with no cards lands on this page, they are automatically redirected to the "Create" page.

### 3.5. Study Module (`/study`)

- **Interface**: A minimal, distraction-free interface showing one card at a time.
- **Card Selection**: A random card is fetched from the user's collection via `GET /api/flashcards/study/random`.
- **Interaction**: The front of the card (question) is shown by default. The user can click the card to flip it and reveal the answer on the back.
- **Navigation**: A "Next Card" button allows the user to fetch another random card.

### 3.6. Navigation & Layout

- **Layout**: A consistent layout will be used across all pages, including a global header and footer.
- **Authenticated Navigation**: For logged-in users, the header will contain links to "Create," "My Cards," and "Study," along with a user dropdown menu for accessing the "Account" page and logging out.
- **Unauthenticated Navigation**: For logged-out users, the header will show links to "Login" and "Sign Up."

## 4. Product Boundaries

### In-Scope (MVP)

- Email/Password authentication via Supabase.
- Flashcard generation from text (1,000-10,000 words).
- Text-only flashcards (Front/Back).
- A single collection of flashcards per user.
- Full review flow (Accept/Reject).
- Card management (View/Delete).
- Random-order study module.
- Database schema designed to be extensible for a future FSRS (Free Spaced Repetition Scheduler) implementation, including columns for `due`, `stability`, `difficulty`, `lapses`, and `state`.

## 5. User Stories

### Authentication & Account Management

- **ID**: US-001, **Title**: New User Registration
- **ID**: US-002, **Title**: Email Verification
- **ID**: US-003, **Title**: User Login
- **ID**: US-004, **Title**: User Logout
- **ID**: US-005, **Title**: Password Reset
- **ID**: US-006, **Title**: Change Password

- **ID**: US-007
- **Title**: Delete Account
- **Description**: As a user, I want to be able to permanently delete my account and all associated data.
- **Acceptance Criteria**:
  - A "Delete Account" option is available on the `/account` page.
  - The user must confirm the deletion action (e.g., by re-entering their password).
  - Upon confirmation, a secure backend process is initiated to permanently delete the user account and all their flashcards from the database.

- ID: US-001
- Title: New User Registration
- Description: As a new user, I want to sign up for an account using my email and a password so that I can create and save my own flashcards.
- Acceptance Criteria:
  - The user can navigate to a sign-up page.
  - The user must provide a valid email and a password.
  - Upon submission, a new user account is created.
  - An email verification message is sent to the user's email address.

- ID: US-002
- Title: Email Verification
- Description: As a new user, I want to verify my email address by clicking a link so that I can secure my account and log in.
- Acceptance Criteria:
  - After signing up, the user receives an email with a verification link.
  - Clicking the link marks the user's account as verified.
  - The user is redirected to a confirmation page or the login page.

- ID: US-003
- Title: User Login
- Description: As a registered user, I want to log in with my email and password so that I can access my flashcards.
- Acceptance Criteria:
  - The user can enter their email and password on a login page.
  - Upon successful authentication, the user is redirected to the "My Cards" dashboard.
  - An error message is shown for incorrect credentials.

- ID: US-004
- Title: User Logout
- Description: As a logged-in user, I want to log out of my account to end my session securely.
- Acceptance Criteria:
  - A "Logout" button is available in the application's navigation.
  - Clicking "Logout" ends the user's session and redirects them to the login or home page.

- ID: US-005
- Title: Password Reset
- Description: As a user who has forgotten my password, I want to request a password reset link via email so I can regain access to my account.
- Acceptance Criteria:
  - A "Forgot Password" link is available on the login page.
  - The user can enter their email address to receive a reset link.
  - The link in the email leads to a page where the user can set a new password.

- ID: US-006
- Title: Change Password
- Description: As a logged-in user, I want to change my password from my account page for security reasons.
- Acceptance Criteria:
  - An "Account" page is accessible to logged-in users.
  - The user can enter their current password and a new password.
  - The account password is updated upon successful submission.

- ID: US-007
- Title: Delete Account
- Description: As a user, I want to be able to permanently delete my account and all associated data.
- Acceptance Criteria:
  - A "Delete Account" option is available on the "Account" page.
  - The user must confirm the deletion action, possibly by typing their password.
  - Upon confirmation, the user account and all their flashcards are permanently deleted.

### Flashcard Creation & Review

- **ID**: US-008
- **Title**: Create Flashcards from Text
- **Description**: As a logged-in user, I want to paste a large piece of text and have the application generate flashcards for me.
- **Acceptance Criteria**:
  - A `/create` page with a text area is available.
  - The text area provides real-time feedback on word count.
  - A "Generate" button is disabled until the word count is between 1,000 and 10,000 words.
  - Clicking "Generate" initiates the backend generation process.

- **ID**: US-009
- **Title**: View Generation Progress
- **Description**: As a user waiting for my flashcards to be created, I want to see a loading indicator so I know the system is working.
- **Acceptance Criteria**:
  - After submitting text, a loading overlay is displayed.
  - The overlay shows text indicating the current stage (e.g., "Analyzing text...", "Generating...").

- **ID**: US-010
- **Title**: Review Generated Flashcards
- **Description**: As a user, I want to review the generated flashcards and decide whether to keep or discard them before they are saved.
- **Acceptance Criteria**:
  - After generation, the user is taken to a `/review` screen.
  - Generated cards are displayed, each with its "Front" (question) and "Back" (answer).
  - Each card has an "Accept" and a "Reject" button.

- **ID**: US-011
- **Title**: Reject a Flashcard
- **Description**: As a user reviewing flashcards, I want to reject a card that is inaccurate or not useful.
- **Acceptance Criteria**:
  - Clicking the "Reject" button on a card discards it.
  - The rejected card is removed from the view and is not saved to the user's collection.

- **ID**: US-012
- **Title**: Accept a Flashcard
- **Description**: As a user reviewing flashcards, I want to accept a card that is accurate and useful so it gets added to my collection.
- **Acceptance Criteria**:
  - Clicking the "Accept" button makes an API call to save the card to the user's collection.
  - The accepted card is removed from the review queue.

- **ID**: US-013
- **Title**: Finish Reviewing
- **Description**: As a user who has finished reviewing all generated cards, I want to see a summary and know what to do next.
- **Acceptance Criteria**:
  - After the last card is reviewed, a success message is displayed.
  - The message states how many cards were added to the collection.
  - The message provides clear buttons to navigate to the "Study" or "Create" pages.

### Card Management & Study

- **ID**: US-014
- **Title**: View My Card Collection
- **Description**: As a returning user, I want to see all of my accepted flashcards on my main dashboard.
- **Acceptance Criteria**:
  - The `/my-cards` page displays the user's cards in a responsive grid.
  - If the user has many cards, infinite scroll is implemented to load them progressively.

- **ID**: US-015
- **Title**: Handle Empty State for New Users
- **Description**: As a new user who has not created any flashcards yet, I want to be guided on what to do when I first log in.
- **Acceptance Criteria**:
  - If a user with zero cards lands on the `/my-cards` page, they are automatically redirected to the `/create` page.

- **ID**: US-016
- **Title**: Delete a Flashcard from Collection
- **Description**: As a user, I want to be able to delete a flashcard from my collection that I no longer need.
- **Acceptance Criteria**:
  - An 'X' icon is visible on each card in the `/my-cards` grid.
  - Clicking the 'X' icon brings up a confirmation pop-up.
  - Confirming the action permanently deletes the card from the user's collection via an API call.

- **ID**: US-017
- **Title**: Study a Flashcard
- **Description**: As a user, I want to be able to study my flashcards one at a time in a focused environment.
- **Acceptance Criteria**:
  - The `/study` page displays a single flashcard from the user's collection.
  - Initially, only the "Front" (question) of the card is visible.
  - Clicking on the card flips it to reveal the "Back" (answer).

- **ID**: US-018
- **Title**: Navigate to the Next Card in Study Mode
- **Description**: As a user in the study module, I want to move to the next card easily.
- **Acceptance Criteria**:
  - A "Next Card" button is present on the study page.
  - Clicking the button loads a new, randomly selected card from the user's collection.

## 6. Success Metrics

### Primary Success Metric

- **AI Quality - Flashcard Acceptance Rate**: The percentage of AI-generated flashcards that users "Accept" during the review process. The target for this metric is >75%. This is the most critical indicator of the core feature's value and effectiveness.

### Secondary Success Metrics

- **User Engagement**:
  - Number of flashcard sets created per user per week.
  - Number of study sessions initiated per user per week.
- **User Retention**:
  - Week 1 retention rate: The percentage of new users who return to use the app in the week after signing up.
  - Month 1 retention rate: The percentage of new users who are still active after one month.

## 7. Deployment and Operations

### Continuous Integration (CI)

A CI pipeline is configured to run on every pull request to the `master` branch. This ensures that all changes are automatically validated before being considered for merging. The pipeline performs the following automated checks:

- **Linting**: Code is checked for style and formatting consistency.
- **Unit Tests**: Automated tests are run to verify individual components and functions.
- **End-to-End (E2E) Tests**: The application is tested from end to end to ensure that key user flows are working as expected.

### Continuous Deployment (CD)

Deployment to the production environment is a manual process triggered after changes have been merged into the `master` branch. The process is as follows:

1.  **Build Docker Image**: A new Docker image is built containing the latest version of the application.
2.  **Push to Registry**: The image is pushed to the GitHub Container Registry.
3.  **Deploy**: The new image is deployed to the production server, updating the running application.
