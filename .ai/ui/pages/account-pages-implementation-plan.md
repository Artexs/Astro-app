# Account Pages Implementation Plan

## 1. Overview

This document details the implementation plan for the user account management pages, including authentication (login, registration, password reset) and account settings (change password, delete account). These pages are built using Astro for routing and page structure, with React components handling the interactive UI and client-side logic.

## 2. Functional Requirements (from PRD)

- **Authentication Provider**: All authentication will be handled by Supabase Auth.
- **Sign-Up**: Users must be able to sign up using an email and password. A verification email will be sent, which the user must click to activate their account.
- **Login/Logout**: Registered users can log in and log out.
- **Password Reset**: A "Forgot Password" flow must be available for users to reset their password via an email link.
- **Account Page**: A dedicated, authenticated `/account` page will allow users to change their password and permanently delete their account.
- **Account Deletion**: Deleting an account is a permanent action that must be confirmed by the user. It will trigger a secure backend process to remove the user from `auth.users` and a cascading delete of all their associated data (flashcards) from the database.

## 3. User Stories (from PRD)

- **US-001: New User Registration**: As a new user, I want to sign up for an account using my email and a password so that I can create and save my own flashcards.
- **US-002: Email Verification**: As a new user, I want to verify my email address by clicking a link so that I can secure my account and log in.
- **US-003: User Login**: As a registered user, I want to log in with my email and password so that I can access my flashcards.
- **US-004: User Logout**: As a logged-in user, I want to log out of my account to end my session securely.
- **US-005: Password Reset**: As a user who has forgotten my password, I want to request a password reset link via email so I can regain access to my account.
- **US-006: Change Password**: As a logged-in user, I want to change my password from my account page for security reasons.
- **US-007: Delete Account**: As a user, I want to be able to permanently delete my account and all associated data.

## 4. Page by Page Breakdown

### 4.1. Login Page (`/login`)

- **Astro Page**: `src/pages/login.astro`
- **React Component**: `src/components/views/auth/LoginForm.tsx`
- **Description**: Provides a form for existing users to log into their accounts using email and password.
- **UI Elements**:
  - Email input field (`Input`)
  - Password input field (`Input`)
  - Login button (`Button`)
  - "Forgot password?" link
  - "Don't have an account? Sign up" link
  - Error display (`Alert`)
- **Interactions**:
  - Submits email and password to the authentication service.
  - Displays loading state during submission.
  - Redirects to `/my-cards` on successful login (as per PRD US-003).
  - Displays error messages for invalid credentials or other login failures.
- **Associated Hooks/Services**: `useLogin` hook handles form state, submission, and interaction with the authentication service.

### 4.2. Register Page (`/register`)

- **Astro Page**: `src/pages/register.astro`
- **React Component**: `src/components/views/auth/RegisterForm.tsx`
- **Description**: Allows new users to create an account with an email and password.
- **UI Elements**:
  - Email input field (`Input`)
  - Password input field (`Input`)
  - Confirm Password input field (`Input`)
  - Create Account button (`Button`)
  - "Already have an account? Log in" link
  - Error display (`Alert`)
- **Interactions**:
  - Submits email and password to the registration service.
  - Performs client-side validation for password matching and format.
  - Displays loading state during submission.
  - Redirects to `/registration-success` on successful registration.
  - Displays error messages for registration failures (e.g., email already in use, weak password).
- **Associated Hooks/Services**: `useRegister` hook handles form state, validation, submission, and interaction with the authentication service.

### 4.3. Registration Success Page (`/registration-success`)

- **Astro Page**: `src/pages/registration-success.astro`
- **Description**: Informs the user that their registration was successful and prompts them to check their email for a verification link.
- **UI Elements**:
  - Card (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`)
  - Success message text.

### 4.4. Forgot Password Page (`/forgot-password`)

- **Astro Page**: `src/pages/forgot-password.astro`
- **React Component**: `src/components/views/auth/ForgotPasswordForm.tsx`
- **Description**: Enables users to request a password reset link to be sent to their registered email address.
- **UI Elements**:
  - Email input field (`Input`)
  - Send Reset Link button (`Button`)
  - "Back to login" link
  - Success/Error message display (to be implemented)
- **Interactions**:
  - Submits the provided email address to trigger a password reset email.
  - Displays success message upon successful email dispatch or error message for failures.
- **Associated Hooks/Services**: A dedicated `useForgotPassword` hook will handle form state, submission, and interaction with the authentication service.

### 4.5. Reset Password Page (`/reset-password`)

- **Astro Page**: `src/pages/reset-password.astro`
- **React Component**: `src/components/views/auth/ResetPasswordForm.tsx`
- **Description**: Allows users to set a new password after receiving a reset link via email.
- **UI Elements**:
  - New Password input field (`Input`)
  - Confirm New Password input field (`Input`)
  - Reset Password button (`Button`)
  - Loading and error states (to be implemented)
- **Interactions**:
  - Submits the new password and confirmation to update the user's password.
  - Displays loading state during submission and error messages for failures.
- **Associated Hooks/Services**: A dedicated `useResetPassword` hook will handle form state, submission, and interaction with the authentication service.

### 4.6. Account Page (`/account`)

- **Astro Page**: `src/pages/account.astro`
- **React Component**: `src/components/views/auth/AccountView.tsx`
- **Description**: A central page for authenticated users to manage their account settings, specifically changing their password and deleting their account.
- **UI Elements**:
  - **Change Password Form** (`ChangePasswordForm.tsx`):
    - Current Password input field (`Input`)
    - New Password input field (`Input`)
    - Confirm New Password input field (`Input`)
    - Change Password button (`Button`)
  - **Delete Account Form** (`DeleteAccountForm.tsx`):
    - Password confirmation input field (`Input`)
    - Delete Account button (`Button`, `variant="destructive"`)
    - Confirmation modal (to be implemented)
- **Interactions**:
  - `ChangePasswordForm`: Allows users to update their password. Logic will be implemented in a dedicated hook/service.
  - `DeleteAccountForm`: Provides a mechanism for users to permanently delete their account, requiring password confirmation and an additional confirmation modal. Logic will be implemented in a dedicated hook/service, interacting with the backend API for account deletion.

## 5. UI Components Used (from `src/components/ui/`)

- `Alert`, `AlertDescription`, `AlertTitle`: For displaying messages (e.g., errors, success).
- `Button`: For interactive actions.
- `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`: For structuring content and forms.
- `Input`: For text and password input fields.
- `Label`: For form field labels.

## 6. Hooks/Services Used

- `useLogin` (`src/components/hooks/useLogin.ts`): Manages login form state, submission, and authentication logic.
- `useRegister` (`src/components/hooks/useRegister.ts`): Manages registration form state, validation, submission, and authentication logic.
- `useForgotPassword` (to be created): Will manage forgot password form state and submission.
- `useResetPassword` (to be created): Will manage reset password form state and submission.
- `useChangePassword` (to be created): Will manage change password form state and submission.
- `useDeleteAccount` (to be created): Will manage delete account form state and submission.
- `useReviewView` (`src/components/hooks/useReviewView.ts`): (Not directly used in account management, but listed in `src/components/hooks`)
- `useMyCards` (`src/components/hooks/useMyCards.ts`): (Not directly used in account management, but listed in `src/components/hooks`)
- `useStudyView` (`src/components/hooks/useStudyView.ts`): (Not directly used in account management, but listed in `src/components/hooks`)
- `ai.service.ts` (`src/lib/services/ai.service.ts`): (Not directly used in account management)
- `flashcard.service.ts` (`src/lib/services/flashcard.service.ts`): (Not directly used in account management)

**Note**: Password strength requirements (8 digits, lowercase, uppercase letters, numbers) will be implemented for registration, change password, and reset password forms. The `ChangePasswordForm` and `DeleteAccountForm` components will have their actual logic for interacting with Supabase Auth (e.g., `updateUser` for password change, and a backend API call for account deletion) implemented in dedicated hooks or services, similar to `useLogin` and `useRegister`.
