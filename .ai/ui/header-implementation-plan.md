# Header Component Implementation Plan

## 1. Component Overview

The `Header` is a global, responsive UI component responsible for top-level navigation and user session management. It will be displayed on all pages of the application and will adapt its content based on the user's authentication status.

This component will be implemented as a React component within the Astro project structure, likely located at `src/components/layout/Header.tsx`.

## 2. States and Variants

The `Header` component will have two primary states:

### 2.1. Authenticated State

- **Trigger**: When a user is logged in (i.e., a valid Supabase session exists).
- **Displayed Elements**:
  - **Logo**: The application logo, which links to the main dashboard (`/my-cards`).
  - **Navigation Links**:
    - `Create` (links to `/create`)
    - `My Cards` (links to `/my-cards`)
    - `Study` (links to `/study`)
  - **User Menu**: A dropdown menu triggered by clicking on the user's avatar or email. It will contain:
    - `Account` (links to `/account`)
    - `Logout` (a button to sign the user out).

### 2.2. Unauthenticated State

- **Trigger**: When no user is logged in.
- **Displayed Elements**:
  - **Logo**: The application logo, which links to the homepage (`/`).
  - **Authentication Links**:
    - `Login` (links to `/login`)
    - `Sign Up` (links to `/signup`)

## 3. Props and Data Dependencies

- **`user: User | null`**: The component will likely receive the current user object (or null if not authenticated) as a prop. This data will be provided by a global authentication context that wraps the application.

## 4. User Interactions and Logic

- **Navigation**: Clicking on any navigation link (`Create`, `My Cards`, `Study`, `Account`, `Login`, `Sign Up`) will trigger a client-side navigation to the corresponding Astro page.
- **Logout**:
  - The `Logout` button will have an `onClick` handler.
  - This handler will call the `supabase.auth.signOut()` function from the Supabase JS library.
  - Upon successful sign-out, the application will redirect the user to the login page (`/login`).
- **Active Link Highlighting**: The component will use the current URL (e.g., from Astro's `Astro.url.pathname` passed down to the component) to determine which navigation link is "active" and apply a distinct visual style to it.

## 5. Responsiveness and Mobile View

- **Desktop (Large Screens)**: The header will display the logo on the left and the navigation links and user menu/auth links on the right, arranged horizontally.
- **Mobile (Small Screens)**:
  - The navigation links and user menu will be collapsed into a hamburger menu icon.
  - Clicking the hamburger icon will open a slide-out panel or a dropdown overlay containing the navigation items.
  - The logo will remain visible.

## 6. Accessibility Considerations

- The navigation links will be implemented as standard `<a>` tags for semantic correctness.
- The User Menu dropdown and the mobile hamburger menu will be implemented with ARIA attributes (`aria-haspopup`, `aria-expanded`, etc.) to ensure they are accessible to screen readers.
- Focus will be managed correctly when the mobile menu or user dropdown is opened and closed.
- All interactive elements (links, buttons, menu triggers) will have clear, accessible names and sufficient touch/click target sizes.
