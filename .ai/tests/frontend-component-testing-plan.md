### Detailed Plan for Testing Frontend Components

This plan outlines the strategy for testing React components within the Astro project, building upon the existing unit testing framework (Vitest and React Testing Library).

#### 1. Component Categorization and Prioritization

To effectively manage testing efforts, React components will be categorized based on their complexity, criticality, and interaction patterns.

*   **Category A: Critical Views & Forms (High Priority)**
    *   **Description:** Components that encapsulate significant business logic, manage complex state, handle user input, interact with APIs, or are central to core user flows. These often correspond to full pages or major sections of a page.
    *   **Examples:** `CreateView.tsx`, `MyCardsView.tsx`, `ReviewView.tsx`, `StudyView.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `ChangePasswordForm.tsx`, `DeleteAccountForm.tsx`, `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`.
    *   **Testing Focus:** Comprehensive integration tests using React Testing Library to simulate user interactions (typing, clicking, submitting), verify state changes, API calls (mocked), and correct rendering of data and error states. Unit tests for any complex internal helper functions.
    *   **Coverage Target:** 80-90% statement, branch, and function coverage.

*   **Category B: Interactive Components & Hooks (Medium Priority)**
    *   **Description:** Reusable components or custom hooks that manage specific interactive behaviors, data fetching, or encapsulate a piece of UI logic.
    *   **Examples:** `InfiniteScrollLoader.tsx`, `ManagedCard.tsx`, `ReviewableCard.tsx`, `StudyCard.tsx`, `WordCountValidator.tsx`, and all custom hooks in `src/components/hooks/` (e.g., `useMyCards`, `useReviewView`, `useStudyView`).
    *   **Testing Focus:**
        *   **Hooks:** Unit tests using `@testing-library/react-hooks` (or similar Vitest-compatible approach) to verify state management, side effects, and return values in isolation. Mock all external dependencies.
        *   **Components:** Integration tests focusing on their specific interactive behavior, prop handling, and rendering based on different states.
    *   **Coverage Target:** 70-85% statement, branch, and function coverage.

*   **Category C: Presentational UI Components (Lower Priority)**
    *   **Description:** Simple, stateless or minimally stateful components primarily responsible for rendering UI based on props. These often come from UI libraries (like `shadcn/ui` components).
    *   **Examples:** `alert-dialog.tsx`, `alert.tsx`, `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `sheet.tsx`, `GenerationLoadingOverlay.tsx`, `ReviewCompletion.tsx`.
    *   **Testing Focus:** Basic snapshot tests (if desired for visual consistency, though generally avoided for pure unit tests) and simple render tests to ensure they mount without errors and display correct props. Focus on conditional rendering if any.
    *   **Coverage Target:** 50-70% statement coverage (primarily for conditional rendering logic).

#### 2. Testing Levels: Unit and Integration Tests

The project will primarily focus on **Unit Tests** and **Integration Tests** for frontend components.

*   **Unit Tests:**
    *   **Purpose:** To test individual functions, classes, or hooks in isolation, ensuring their internal logic works as expected. Dependencies are heavily mocked.
    *   **Tools:** Vitest, `@testing-library/react-hooks` (or equivalent for hooks).
    *   **Application:** Primarily for custom hooks (`src/components/hooks/`) and complex utility functions within components.
    *   **Example:** Testing `useLogin` hook to ensure it calls the authentication service correctly and updates loading/error states.

*   **Integration Tests (Component Level):**
    *   **Purpose:** To test how multiple units (e.g., a component and its child components, or a component and a custom hook it uses) work together, simulating user interaction and verifying the component's behavior from a user's perspective.
    *   **Tools:** Vitest, React Testing Library (`@testing-library/react`), `@testing-library/jest-dom`.
    *   **Application:** All Category A and B components.
    *   **Example:** Testing `LoginForm.tsx` by simulating typing into input fields, clicking the submit button, and asserting that the login function (mocked) is called and the UI updates (e.g., shows a success message or error).

*   **End-to-End (E2E) Tests:**
    *   **Current Status:** No E2E tests are currently planned or implemented.
    *   **Recommendation:** While not part of this immediate plan, E2E tests (using tools like Playwright or Cypress) would be beneficial for verifying critical user flows across the entire application (frontend to backend). These would be a separate phase of testing.

#### 3. Mocking Strategies for Frontend Components

*   **MSW (Mock Service Worker):**
    *   **Purpose:** For intercepting and mocking actual network requests made by components (e.g., `fetch` calls to Astro API routes or external AI services). This provides a highly realistic testing environment without needing a live backend.
    *   **Implementation:** Define request handlers in `src/__tests__/mocks/handlers.ts` for specific API endpoints. Start the MSW server in `setupTests.ts` (or `beforeAll` in test files) and reset handlers in `afterEach`.
    *   **Example:** Mocking the `/api/flashcards/generate` endpoint to return a predefined set of flashcards when `CreateView.tsx` attempts to generate them.

*   **Supabase Client Mocking:**
    *   **Purpose:** For components or hooks that directly interact with the Supabase client (`supabase.client.ts`).
    *   **Implementation:** Use `vi.mock` to mock the `supabase.client.ts` module or specific methods of the Supabase client instance. This allows controlling the return values of Supabase operations (e.g., `signInWithPassword`, `from('table').select()`).
    *   **Example:** Mocking `supabase.auth.signInWithPassword` in `useLogin.test.ts` to simulate successful login or authentication errors.

*   **React Context Mocking:**
    *   **Purpose:** For components that consume values from React Context (e.g., an `AuthContext`).
    *   **Implementation:** Create a test utility that renders the component wrapped in a mock context provider. This provider will supply controlled values (e.g., `user: null` for logged out, `user: { id: '123' }` for logged in).

#### 4. Testing User Interactions and Error Handling

*   **User Interactions:**
    *   **Focus:** Prioritize testing interactions that change component state, trigger data fetching, or lead to navigation.
    *   **Methods:** Use `fireEvent` or `userEvent` from React Testing Library to simulate events like `click`, `change`, `submit`. `userEvent` is generally preferred as it more closely mimics real browser interactions.
    *   **Assertions:** Assert that the UI updates correctly, functions are called with expected arguments, or navigation occurs.

*   **Error Handling:**
    *   **Focus:** Crucial for robust applications. Test scenarios where API calls fail, invalid data is provided, or unexpected errors occur.
    *   **Methods:**
        *   **Mocking:** Configure MSW or Supabase mocks to return error responses.
        *   **Simulate Errors:** For synchronous logic, directly throw errors within mocked functions.
        *   **Assertions:** Assert that error messages are displayed to the user, fallback UI is rendered, or appropriate error logging occurs.

#### 5. Test Structure and Organization (Reinforced)

*   **Directory Structure:** Test files will continue to be placed in a `__tests__` directory parallel to the `src` directory, mirroring the `src` folder structure.
    *   Example: `src/components/views/auth/LoginForm.tsx` will have its tests in `src/__tests__/components/views/auth/LoginForm.test.tsx`.
*   **Naming Conventions:**
    *   Test files: `[ComponentName].test.tsx` for React components.
    *   Test suites: `describe('ComponentName', () => { ... });`.
    *   Test cases: `it('should render correctly', () => { ... });`, `it('should handle form submission', async () => { ... });`.

#### 6. Implementation Phases (Updated)

The existing implementation phases will be updated to reflect the detailed frontend component testing plan.

*   **Phase 1: Setup & Core Utilities (Estimated: 1 week)**
    *   Set up Vitest, React Testing Library, Supertest, and MSW.
    *   Configure `vitest.config.ts`.
    *   Write unit tests for `src/lib/utils.ts`.
    *   Establish basic mocking patterns for Supabase client and external AI service.
    *   **Add:** Set up React Context mocking utilities.
*   **Phase 2: Core Services & Data Layer (Estimated: 2 weeks)**
    *   Develop comprehensive unit tests for `src/lib/services/flashcard.service.ts`, mocking `supabase.client.ts`.
    *   Develop comprehensive unit tests for `src/lib/services/ai.service.ts`, mocking the external AI API calls using MSW.
*   **Phase 3: API Routes & Authentication Hooks (Estimated: 3 weeks)**
    *   Write API endpoint tests for all routes in `src/pages/api/**/*.ts` using Supertest, mocking underlying services.
    *   Implement unit tests for all authentication-related hooks in `src/components/hooks/` (e.g., `useLogin`, `useRegister`, `useDeleteAccount`), mocking Supabase Auth client interactions.
*   **Phase 4: UI Components & Views (Estimated: 4 weeks)**
    *   **Update:** Develop integration tests for **Category A: Critical Views & Forms** (e.g., `CreateView.tsx`, `MyCardsView.tsx`, `LoginForm.tsx`). Focus on user interactions, state changes, API call mocking (MSW/Supabase), and error handling.
    *   **Update:** Develop integration tests for **Category B: Interactive Components** (e.g., `InfiniteScrollLoader.tsx`, `ManagedCard.tsx`).
    *   **Add:** Develop unit tests for **Category B: Custom Hooks** (e.g., `useMyCards`, `useReviewView`).
    *   **Add (Optional):** Basic render tests for **Category C: Presentational UI Components**.
*   **Phase 5: Edge Cases, Error Handling & Refinement (Estimated: 1 week)**
    *   Review existing tests and add tests for uncovered edge cases, error states, and less common user flows, especially for frontend components.
    *   Refine test data, mocks, and assertions for clarity and robustness.
    *   Integrate coverage reporting and set up CI/CD.
