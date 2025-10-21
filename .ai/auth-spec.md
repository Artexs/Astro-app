# Technical Specification: User Authentication Module

## 1. Introduction

This document describes the architecture and implementation details of the authentication, registration, and account recovery system for the AI Flashcard Generator application. The system will be implemented based on Astro, React, and the Supabase Auth service, in accordance with requirements US-001 through US-007 from `prd.md`.

## 2. User Interface (UI) Architecture

### 2.1. New Pages

The following `.astro` pages will be created in the `src/pages/` directory:

-   **`/login.astro`**: Login page. It will render a React component with the login form. If the user is already logged in, they will be redirected to `/my-cards`.
-   **`/register.astro`**: Registration page. It will render a React component with the registration form. After successful registration, it will display a message about the need to verify the email address.
-   **`/forgot-password.astro`**: Page to initiate the password reset process. It will render a React component with a form to enter an email address.
-   **`/reset-password.astro`**: The page the user lands on after clicking the link from the password reset email. It will contain a form to set a new password.
-   **`/account.astro`**: Account management page, accessible only to logged-in users. It will allow changing the password and deleting the account.

### 2.2. New Components

React components (`.tsx`) responsible for form logic will be created in the `src/components/views/auth/` directory:

-   **`LoginForm.tsx`**: Login form with fields for email and password. It will communicate with Supabase Auth to authenticate the user.
-   **`RegisterForm.tsx`**: Registration form with fields for email and password. It will handle the registration process through Supabase Auth.
-   **`ForgotPasswordForm.tsx`**: Form for sending a password reset request.
-   **`ResetPasswordForm.tsx`**: Form for setting a new password.
-   **`ChangePasswordForm.tsx`**: Component on the `/account` page for changing the password by a logged-in user.
-   **`DeleteAccountForm.tsx`**: Component on the `/account` page for deleting the account, requiring confirmation (e.g., by re-entering the password).

### 2.3. Modification of Existing Elements

-   **`src/components/layout/Header.tsx`**: The header component will be modified to dynamically render navigation links depending on the user's authentication state.
    -   **Logged-out mode**: "Login" (`/login`) and "Sign Up" (`/register`) links.
    -   **Logged-in mode**: "My Cards" (`/my-cards`), "Create" (`/create`), "Study" (`/study`) links, and a user menu with "Account" (`/account`) and "Logout" options.
-   **`src/layouts/Layout.astro`**: The main application layout. It will receive user session information from `Astro.locals` (provided by the middleware) and pass it to the `Header.tsx` component as `props`.

### 2.4. Validation and Error Handling (Client-Side)

-   React forms will use real-time validation.
-   **Example rules**:
    -   Email address must have a valid format.
    -   Password must be at least 8 characters long.
-   **Error messages**:
    -   "Invalid email address or password." (login error)
    -   "A user with this email address already exists." (registration error)
    -   "Passwords do not match." (change/reset password)
    -   "Check your email inbox to complete the registration." (registration success)

### 2.5. Key User Scenarios

1.  **Login**: The user fills out the form on `/login`. After a successful login, they are redirected to `/my-cards`.
2.  **Logout**: The user clicks "Logout" in the header. The session is terminated, and the user is redirected to the `/login` page.
3.  **Accessing a protected page**: A non-logged-in user trying to access `/my-cards` or another protected page is automatically redirected to `/login`.
4.  **Registration**: The user fills out the form on `/register`. After submission, they receive a message about the need for email verification and are not yet logged in.

## 3. Backend Logic

### 3.1. Middleware

The key element of the backend logic will be Astro middleware, defined in `src/middleware/index.ts`. Its tasks are:

1.  **Initialize Supabase SSR**: For each incoming server request, the middleware will create a Supabase client instance using the cookies from that request.
2.  **Fetch Session**: It will retrieve user session information (`const { data: { session } } = await supabase.auth.getSession()`).
3.  **Inject Session into Context**: It will make the session object (or `null`) globally available in the application via `Astro.locals.session`. This allows every `.astro` page to check the login status on the server side.
4.  **Protect Pages**: It will define a list of protected routes (e.g., `/my-cards`, `/create`, `/study`, `/account`). If the user does not have an active session (`!session`) and tries to access a protected route, the middleware will return a redirect (`Astro.redirect('/login')`).

### 3.2. API Endpoints

Most authentication operations (login, registration) will be handled directly by the Supabase client library, which communicates with dedicated Supabase endpoints. However, for security and server-side handling, we will create one endpoint:

-   **`POST /api/auth/logout`**: This endpoint will be responsible for securely logging out the user on the server side. It will call the `supabase.auth.signOut()` method using the server-side Supabase client, which will invalidate the session and clear the relevant cookies.

### 3.3. Server-Side Rendering (SSR)

Thanks to the `output: "server"` configuration in `astro.config.mjs` and the middleware, `.astro` pages will be able to make decisions at the server-rendering stage.

-   **Example (`my-cards.astro`)**:
    ```astro
    ---
    const { session } = Astro.locals;
    // The session is already verified by the middleware, so no need to re-check it here.
    // We can safely use session.user.id to fetch data from the database.
    const flashcards = await getFlashcardsForUser(session.user.id);
    ---
    <!-- Render the page with flashcards -->
    ```

## 4. Authentication System (Supabase Auth)

### 4.1. Configuration

-   The following variables will be added to the environment files (`.env`):
    -   `SUPABASE_URL`: The public URL of the Supabase project.
    -   `SUPABASE_KEY`: The public `anon` key of the Supabase project.
-   A central Supabase client will be created in `src/db/supabase.client.ts`, which will re-export clients for the client-side and server-side, using the `@supabase/supabase-js` and `@supabase/ssr` libraries.

### 4.2. Client-Side Integration (React Components)

-   Form components (`LoginForm.tsx`, `RegisterForm.tsx`, etc.) will import the client-side Supabase instance.
-   **Login**: Call `supabase.auth.signInWithPassword({ email, password })`.
-   **Registration**: Call `supabase.auth.signUp({ email, password })`. Supabase will automatically send a verification email.
-   **Password Reset**: Call `supabase.auth.resetPasswordForEmail(email)`.
-   **Change Password (logged in)**: Call `supabase.auth.updateUser({ password: newPassword })`.

### 4.3. Server-Side Integration (Astro Middleware)

-   As described in section 3.1, the middleware will use the `@supabase/ssr` package to manage the session in the Astro server environment.
-   Creating the Supabase client in the middleware will look like this:
    ```typescript
    // src/middleware/index.ts
    import { createServerClient } from '@supabase/ssr';

    export const onRequest = async (context, next) => {
      const supabase = createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get: (key) => context.cookies.get(key)?.value,
            set: (key, value, options) => context.cookies.set(key, value, options),
            remove: (key, options) => context.cookies.delete(key, options),
          },
        }
      );
      // ... further middleware logic
    };
    ```
-   This integration will ensure that the authentication state is consistent between server-side rendering, client-side navigation, and API calls.
