# Product Requirements Document (PRD) - AI Flashcard Generator

## 1. Product Overview

This document outlines the requirements for an AI-powered web application that automatically generates flashcards from user-provided text. The application will handle user authentication, allow users to input large blocks of text, use an AI service to create question-and-answer flashcards, and provide a platform for users to review, manage, and study these cards. The goal is to create a seamless experience for users who want to quickly create study materials from existing notes, articles, or documents without manual effort.

## 2. User Problem

Students and lifelong learners often have large volumes of text (e.g., lecture notes, articles, textbook chapters) that they need to convert into effective study materials. The process of manually creating flashcards is time-consuming, tedious, and can be a significant barrier to efficient learning. Users need a tool that can automate the creation of high-quality, relevant flashcards, allowing them to spend more time studying and less time on preparation.

## 3. Functional Requirements

### 3.1. User Authentication & Account Management
- Users must be able to sign up using an email and password.
- A verification email will be sent upon sign-up, which the user must complete to activate their account.
- Registered users can log in and log out.
- A "Forgot Password" flow must be available for users to reset their password.
- A dedicated "Account" page will allow users to change their password and permanently delete their account.
- Authentication will be handled by Supabase.

### 3.2. Flashcard Generation
- Authenticated users can access a "Create" page to generate new flashcards.
- The user must input text between 1,000 and 10,000 words.
- The generation process is synchronous. A loading screen with a dynamic progress indicator (e.g., "Analyzing text...", "Generating...") will be displayed to the user.
- The AI service will generate flashcards in a "Question/Answer" format. The front of the card will be the question, and the back will be the answer.

### 3.3. Flashcard Review
- After generation, the user is presented with a review screen displaying the potential flashcards.
- Cards are displayed in a 3-column grid with infinite scroll.
- Each card has an "Accept" and a "Reject" button.
- Rejecting a card changes its color to red.
- Accepted cards changes its color to green and are saved to the user's collection.

### 3.4. Card Management ("My Cards")
- The main dashboard for a logged-in user is the "My Cards" page.
- It displays all of the user's accepted flashcards in a 3-column grid with infinite scroll.
- Users can delete a card from this view via an 'X' icon. A confirmation pop-up will be required to prevent accidental deletion.
- If a new user with no cards lands on this page, they are automatically redirected to the "Create" page.

### 3.5. Study Module
- The interface is minimal, showing one card at a time (front side visible).
- The user can click the card to flip it and reveal the answer on the back.
- A "Next Card" button allows the user to move to the next flashcard, which is chosen randomly from their collection.

### 3.6. Navigation & User Flow
- The application will have a simple navigation bar with links to "Create," "My Cards," and "Study."
- After a user finishes reviewing a newly generated set of cards, a success message will appear, showing the number of cards added to their collection and providing navigation options to "Study" or "Create" more.

## 4. Product Boundaries

### In-Scope (MVP)
- Email/Password authentication via Supabase.
- Flashcard generation from text (1,000-10,000 words).
- Text-only flashcards (Front/Back).
- A single collection of flashcards per user.
- Full review flow (Accept/Reject).
- Card management (View/Delete).
- Random-order study module.
- Database schema designed to be extensible for a future FSRS (Free Spaced Repetition Scheduler) implementation.

## 5. User Stories

### Authentication & Account Management
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
- ID: US-008
- Title: Create Flashcards from Text
- Description: As a logged-in user, I want to paste a large piece of text and have the application generate flashcards for me.
- Acceptance Criteria:
    - A "Create" page with a text area is available.
    - The text area accepts input between 1,000 and 10,000 words.
    - A "Generate" button is disabled until the word count is within the valid range.
    - Clicking "Generate" initiates the synchronous creation process.

- ID: US-009
- Title: View Generation Progress
- Description: As a user waiting for my flashcards to be created, I want to see a loading indicator so I know the system is working.
- Acceptance Criteria:
    - After submitting text for generation, a loading screen is displayed.
    - The screen shows dynamic text indicating the current stage (e.g., "Analyzing text...", "Generating...").

- ID: US-010
- Title: Review Generated Flashcards
- Description: As a user, I want to review the generated flashcards one by one and decide whether to keep or discard them.
- Acceptance Criteria:
    - Generated cards are displayed in a 3-column grid.
    - Each card displays its "Front" and "Back" text.
    - Each card has an "Accept" and a "Reject" button.

- ID: US-011
- Title: Reject a Flashcard
- Description: As a user reviewing flashcards, I want to reject a card that is inaccurate or not useful.
- Acceptance Criteria:
    - Clicking the "Reject" button on a card triggers a fade-out animation.
    - The rejected card is removed from the view and is not saved.

- ID: US-012
- Title: Accept a Flashcard
- Description: As a user reviewing flashcards, I want to accept a card that is accurate and useful so it gets added to my collection.
- Acceptance Criteria:
    - Clicking the "Accept" button saves the card to my collection.
    - The accepted card can optionally be visually distinguished (e.g., fades out, shows a checkmark) and is removed from the review queue.

- ID: US-013
- Title: Finish Reviewing
- Description: As a user who has finished reviewing all generated cards, I want to see a summary and know what to do next.
- Acceptance Criteria:
    - After the last card is reviewed, a success message is displayed.
    - The message states how many cards were added to the collection.
    - The message provides clear buttons to "Study" the new cards or "Create" another set.

### Card Management & Study
- ID: US-014
- Title: View My Card Collection
- Description: As a returning user, I want to see all of my accepted flashcards on my main dashboard.
- Acceptance Criteria:
    - When a logged-in user with existing cards visits the "My Cards" page, their cards are displayed in a 3-column grid.
    - If the user has many cards, infinite scroll is implemented to load them progressively.

- ID: US-015
- Title: Handle Empty State for New Users
- Description: As a new user who has not created any flashcards yet, I want to be guided on what to do when I first log in.
- Acceptance Criteria:
    - If a user with zero cards lands on the "My Cards" page, they are automatically redirected to the "Create" page.

- ID: US-016
- Title: Delete a Flashcard from Collection
- Description: As a user, I want to be able to delete a flashcard from my collection that I no longer need.
- Acceptance Criteria:
    - An 'X' icon is visible on each card in the "My Cards" grid.
    - Clicking the 'X' icon brings up a confirmation pop-up.
    - Confirming the action permanently deletes the card from the user's collection.

- ID: US-017
- Title: Study a Flashcard
- Description: As a user, I want to be able to study my flashcards one at a time in a focused environment.
- Acceptance Criteria:
    - The "Study" page displays a single flashcard from the user's collection.
    - Initially, only the "Front" (question) of the card is visible.
    - Clicking on the card flips it to reveal the "Back" (answer).

- ID: US-018
- Title: Navigate to the Next Card in Study Mode
- Description: As a user in the study module, I want to move to the next card easily.
- Acceptance Criteria:
    - A "Next Card" button is present on the study page.
    - Clicking the button loads a new, randomly selected card from the user's collection.

## 6. Success Metrics

### Primary Success Metric
- *AI Quality - Flashcard Acceptance Rate*: The percentage of AI-generated flashcards that users "Accept" during the review process. The target for this metric is >75%. This is the most critical indicator of the core feature's value and effectiveness.

### Secondary Success Metrics
- *User Engagement*:
    - Number of flashcard sets created per user per week.
    - Number of study sessions initiated per user per week.
- *User Retention*:
    - Week 1 retention rate: The percentage of new users who return to use the app in the week after signing up.
    - Month 1 retention rate: The percentage of new users who are still active after one month.
