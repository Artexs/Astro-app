# Unit Testing Implementation Plan for AI Flashcard Generator

## Project Understanding

### Core Functionality and Features

The AI Flashcard Generator is a web application that automates flashcard creation from user-provided text. Key features include:

- **User Authentication & Account Management:** Sign-up, login, logout, password reset, account page (change password, delete account) via Supabase Auth.
- **Flashcard Generation:** Users input text (1,000-10,000 words), which is sent to a backend API (`/api/flashcards/generate`) to an external AI service for generating question/answer flashcards.
- **Flashcard Review:** Users review generated cards, accepting or rejecting them. Accepted cards are saved to the user's collection.
- **Card Management:** A "My Cards" dashboard (`/my-cards`) displays user's flashcards with infinite scroll and deletion functionality.
- **Study Module:** A minimalist study interface (`/study`) fetches random cards for review.
- **Navigation & Layout:** Consistent header/footer with authenticated/unauthenticated navigation states.

### Technology Stack, Frameworks, and Tools

- **Frontend:** Astro (web framework, SSR), React (interactive UI components), TypeScript, Tailwind CSS.
- **Backend & Database:** Supabase (BaaS: Auth, PostgreSQL Database with Row Level Security), Astro API Routes (serverless endpoints).
- **AI:** External AI Service (TBD, e.g., OpenAI, Google Gemini) integrated via backend API routes.
- **Development & Tooling:** Node.js, ESLint, Prettier.

### Project Structure and Architecture

The project follows a component-based architecture with clear separation of concerns:

- `src/layouts/`: Astro layouts for consistent page structure.
- `src/pages/`: Astro pages for routing, including `api/` for backend endpoints.
- `src/components/`: UI components, further organized into `hooks/`, `layout/`, `ui/`, and `views/`.
- `src/lib/`: Contains `types.ts`, `utils.ts`, and `services/` (e.g., `ai.service.ts`, `flashcard.service.ts`) for business logic and external integrations.
- `src/db/`: Supabase client and database types.

### Key Components, Modules, and Services

- **Authentication Hooks:** `useLogin`, `useRegister`, `useChangePassword`, `useForgotPassword`, `useResetPassword`, `useDeleteAccount` (in `src/components/hooks/`).
- **Flashcard Services:** `flashcard.service.ts` (CRUD operations for flashcards), `ai.service.ts` (interface with external AI).
- **API Routes:** `src/pages/api/flashcards/generate.ts`, `src/pages/api/flashcards/index.ts` (GET/POST), `src/pages/api/flashcards/[id].ts` (DELETE), `src/pages/api/flashcards/study/random.ts`.
- **React Views:** `AccountView.tsx`, `CreateView.tsx`, `MyCardsView.tsx`, `ReviewView.tsx`, `StudyView.tsx`, and their sub-components.
- **Utility Functions:** `src/lib/utils.ts`.
- **Supabase Client:** `src/db/supabase.client.ts`.

### Dependencies and Integrations

- **Supabase:** Core dependency for authentication and database.
- **External AI Service:** Critical for flashcard generation.
- **React:** For interactive UI.
- **Astro:** For routing, SSR, and API layer.

## Unit Testing Strategy

### 1. Testing Framework Selection

- **Frontend (React components, hooks, utilities):**
  - **Vitest:** Chosen for its speed, native TypeScript support, and excellent integration with Vite (which Astro uses). It provides a Jest-compatible API, making it familiar for many developers.
  - **React Testing Library:** For testing React components. It encourages testing components the way users interact with them, focusing on accessibility and user-facing behavior rather than internal implementation details.
- **Backend (Astro API routes, services, utility functions):**
  - **Vitest:** Will be used for testing Node.js-based service logic and utility functions.
  - **Supertest:** For testing Astro API routes. It allows for making HTTP assertions against API endpoints, simulating actual requests without needing to run a full server.
- **Additional Utilities:**
  - **`@testing-library/jest-dom`:** Provides custom Jest matchers for more expressive DOM assertions.
  - **`msw` (Mock Service Worker):** For mocking network requests (e.g., to the external AI service or Supabase API) in both frontend and backend tests, providing realistic and reliable test environments.

### 2. Test Coverage Strategy

- **Critical Components for Unit Testing:**
  - **Business Logic Services:** `src/lib/services/flashcard.service.ts`, `src/lib/services/ai.service.ts`. These contain the core application logic and interactions with external systems.
  - **React Hooks:** All hooks in `src/components/hooks/` (e.g., `useLogin`, `useMyCards`) as they encapsulate complex state management, side effects, and data fetching logic.
  - **Astro API Route Handlers:** All files in `src/pages/api/**/*.ts`. These are the entry points for backend logic and handle request parsing, validation, and service orchestration.
  - **Utility Functions:** `src/lib/utils.ts` for any helper functions.
  - **Complex UI Logic:** Components with significant state, user interaction, or conditional rendering (e.g., `WordCountValidator.tsx`, `GenerationLoadingOverlay.tsx`, `ConfirmationModal.tsx`).
- **Coverage Targets and Priorities:**
  - **High Priority (90%+ coverage):** All service files (`src/lib/services/`), React hooks (`src/components/hooks/`), and API route handlers (`src/pages/api/`). These layers are crucial for application correctness and stability.
  - **Medium Priority (70%+ coverage):** Complex React components/views that contain significant logic or user interaction flows.
  - **Low Priority (Optional):** Simple presentational components (e.g., basic `ui/` components) that primarily render props without complex logic.
- **What Should and Shouldn't Be Unit Tested:**
  - **Should Test:**
    - Functionality of service methods (e.g., `flashcard.service.createCard` saves correctly).
    - Logic within React hooks (e.g., `useLogin` handles success, error, loading states).
    - API route request parsing, validation, calling correct services, and response formatting.
    - Input validation logic (e.g., word count).
    - Component behavior based on props and user interactions (e.g., form submission, button clicks, conditional rendering).
    - Error handling and edge cases (e.g., API failures, invalid input, empty data sets).
  - **Should NOT Unit Test:**
    - Third-party library internals (e.g., Supabase client's internal workings, React's rendering engine).
    - Visual aspects or simple CSS styling (Tailwind CSS).
    - Full end-to-end user flows (these are for integration/E2E tests).
    - Astro's core routing or SSR mechanisms.

### 3. Test Structure and Organization

- **Directory Structure:** Test files will be placed in a `__tests__` directory parallel to the `src` directory, mirroring the `src` folder structure.
  - Example: `src/lib/services/flashcard.service.ts` will have its tests in `src/__tests__/lib/services/flashcard.service.test.ts`.
  - Example: `src/components/hooks/useLogin.ts` will have its tests in `src/__tests__/components/hooks/useLogin.test.ts`.
  - Example: `src/pages/api/flashcards/generate.ts` will have its tests in `src/__tests__/pages/api/flashcards/generate.test.ts`.
- **Naming Conventions:**
  - Test files: `[filename].test.ts` or `[filename].test.tsx`.
  - Test suites: Use `describe('ComponentName or ModuleName', () => { ... });`.
  - Test cases: Use `it('should do something specific when...', () => { ... });` or `test('should do something specific when...', () => { ... });`.
- **Organization Relative to Source Code:** This parallel `__tests__` directory approach keeps test files separate from source code while maintaining a clear mapping, making it easy to locate tests for any given source file.

### 4. Implementation Phases

- **Phase 1: Setup & Core Utilities (Estimated: 1 week)**
  - Set up Vitest, React Testing Library, Supertest, and MSW.
  - Configure `vitest.config.ts`.
  - Write unit tests for `src/lib/utils.ts`.
  - Establish basic mocking patterns for Supabase client and external AI service.
  - **Add:** Set up React Context mocking utilities.
- **Phase 2: Core Services & Data Layer (Estimated: 2 weeks)**
  - Develop comprehensive unit tests for `src/lib/services/flashcard.service.ts`, mocking `supabase.client.ts`.
  - Develop comprehensive unit tests for `src/lib/services/ai.service.ts`, mocking the external AI API calls using MSW.
- **Phase 3: API Routes & Authentication Hooks (Estimated: 3 weeks)**
  - Write API endpoint tests for all routes in `src/pages/api/**/*.ts` using Supertest, mocking underlying services.
  - Implement unit tests for all authentication-related hooks in `src/components/hooks/` (e.g., `useLogin`, `useRegister`, `useDeleteAccount`), mocking Supabase Auth client interactions.
- **Phase 4: UI Components & Views (Estimated: 4 weeks)**
  - **Update:** Develop integration tests for **Category A: Critical Views & Forms** (e.g., `CreateView.tsx`, `MyCardsView.tsx`, `LoginForm.tsx`). Focus on user interactions, state changes, API call mocking (MSW/Supabase), and error handling.
  - **Update:** Develop integration tests for **Category B: Interactive Components** (e.g., `InfiniteScrollLoader.tsx`, `ManagedCard.tsx`).
  - **Add:** Develop unit tests for **Category B: Custom Hooks** (e.g., `useMyCards`, `useReviewView`).
  - **Add (Optional):** Basic render tests for **Category C: Presentational UI Components**.
- **Phase 5: Edge Cases, Error Handling & Refinement (Estimated: 1 week)**
  - Review existing tests and add tests for uncovered edge cases, error states, and less common user flows, especially for frontend components.
  - Refine test data, mocks, and assertions for clarity and robustness.
  - Integrate coverage reporting and set up CI/CD.

### 5. Testing Patterns and Best Practices

- **Arrange-Act-Assert (AAA):** Each test should clearly define its setup (Arrange), the action being tested (Act), and the expected outcome (Assert).
- **Mocking/Stubbing Strategies:**
  - **Module Mocks (`vitest.mock`):** Use for mocking entire modules like `src/db/supabase.client.ts` or `src/lib/services/ai.service.ts` to isolate the unit under test from its dependencies.
  - **Function Mocks (`vi.fn()`):** For mocking individual functions or methods within a module.
  - **Network Mocks (`msw`):** Crucial for simulating API responses from Supabase and the external AI service, ensuring tests are fast, reliable, and independent of actual network calls.
  - **React Hook Mocks:** When testing components that consume custom hooks, mock the hook's return values to control its behavior.
  - **React Context Mocking:** Create a test utility that renders the component wrapped in a mock context provider. This provider will supply controlled values (e.g., `user: null` for logged out, `user: { id: '123' }` for logged in).
- **Test Data Management:**
  - Create small, representative test data sets.
  - Use factory functions or builder patterns for generating complex test data (e.g., flashcard objects, user profiles) to ensure consistency and reduce boilerplate.
  - Avoid hardcoding large JSON objects directly in tests.
- **Setup and Teardown Procedures:**
  - Use `beforeEach` and `afterEach` to set up and clean up the test environment for each test (e.g., resetting mocks, cleaning up DOM with `@testing-library/react/cleanup`).
  - Use `beforeAll` and `afterAll` for global setup/teardown (e.g., starting/stopping MSW server).
- **Testing Library Principles:** Prioritize testing user interactions and visible output over internal component state or method calls. Use queries like `getByRole`, `getByText`, `findByText` to interact with the DOM.

### 6. Specific Test Categories

- **Unit Tests for Business Logic:**
  - Verify `flashcard.service.ts` methods correctly interact with the mocked Supabase client (e.g., `createCard`, `getCards`, `deleteCard`).
  - Ensure `ai.service.ts` correctly formats requests to the mocked external AI service and parses its responses.
  - Test `src/lib/utils.ts` functions for correctness and edge cases.
- **API Endpoint Testing:**
  - Use Supertest to send requests to Astro API routes (e.g., `POST /api/flashcards/generate`, `GET /api/flashcards`).
  - Assert correct HTTP status codes, response bodies, and error messages.
  - Verify input validation on API routes.
  - Ensure API routes correctly call and handle responses from mocked services.
- **Database Interaction Testing:**
  - Focus on ensuring the `flashcard.service.ts` and other data-access layers correctly construct and execute Supabase client calls. The actual database logic (RLS, triggers) should be covered by integration/E2E tests, not unit tests. Mock the Supabase client.
- **Component/Module Integration Points:**
  - Test React components' interactions with custom hooks (mocking hook return values).
  - Test how components handle data fetched from services (mocking service responses).
- **Error Handling and Edge Cases:**
  - Test scenarios where external APIs fail (e.g., AI service returns an error, Supabase is unreachable).
  - Test invalid user inputs (e.g., text outside word count limits).
  - Test empty states (e.g., `MyCardsView` with no cards).
  - Test unauthorized access attempts to protected resources.

### 7. CI/CD Integration

- **Build Pipeline Integration:**
  - Add an `npm run test` script (which will execute `vitest run --coverage`) to the CI pipeline.
  - Tests should run automatically on every pull request and commit to the main branch.
- **Test Execution Strategies:**
  - Run all unit tests in a dedicated CI job.
  - Consider parallelizing test execution for faster feedback.
- **Coverage Reporting and Quality Gates:**
  - Configure Vitest to generate coverage reports (e.g., using `c8` or `istanbul` reporters).
  - Set minimum coverage thresholds in `vitest.config.ts` (e.g., 80% statements, branches, functions, lines).
  - Fail the CI build if coverage falls below the defined thresholds, acting as a quality gate.
  - Integrate with a coverage reporting service (e.g., Codecov, Coveralls) for historical tracking and pull request comments.

### 8. Tooling and Configuration

- **Required Configuration Files:**
  - `vitest.config.ts`: Main configuration for Vitest, including test environment, reporters, coverage thresholds, and aliases.
  - `setupTests.ts` (or similar): For global test setup (e.g., importing `@testing-library/jest-dom`, initializing MSW).
- **IDE Setup Recommendations:**
  - **VS Code:** Install the "Vitest" extension for running and debugging tests directly from the editor, viewing test results inline, and getting real-time feedback.
  - Ensure TypeScript is correctly configured for test files.
- **Debugging and Troubleshooting Approaches:**
  - Use the IDE's built-in debugger with Vitest for step-through debugging.
  - Utilize `console.log` statements within tests and components for quick inspection.
  - Leverage Vitest's watch mode (`vitest --watch`) for rapid feedback during development.
  - Use `screen.debug()` from React Testing Library to inspect the rendered DOM in component tests.

### Detailed Plan for Testing Frontend Components

This plan outlines the strategy for testing React components within the Astro project, building upon the existing unit testing framework (Vitest and React Testing Library).

#### 1. Component Categorization and Prioritization

To effectively manage testing efforts, React components will be categorized based on their complexity, criticality, and interaction patterns.

- **Category A: Critical Views & Forms (High Priority)**
  - **Description:** Components that encapsulate significant business logic, manage complex state, handle user input, interact with APIs, or are central to core user flows. These often correspond to full pages or major sections of a page.
  - **Examples:** `CreateView.tsx`, `MyCardsView.tsx`, `ReviewView.tsx`, `StudyView.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `ChangePasswordForm.tsx`, `DeleteAccountForm.tsx`, `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`.
  - **Testing Focus:** Comprehensive integration tests using React Testing Library to simulate user interactions (typing, clicking, submitting), verify state changes, API calls (mocked), and correct rendering of data and error states. Unit tests for any complex internal helper functions.
  - **Coverage Target:** 80-90% statement, branch, and function coverage.

- **Category B: Interactive Components & Hooks (Medium Priority)**
  - **Description:** Reusable components or custom hooks that manage specific interactive behaviors, data fetching, or encapsulate a piece of UI logic.
  - **Examples:** `InfiniteScrollLoader.tsx`, `ManagedCard.tsx`, `ReviewableCard.tsx`, `StudyCard.tsx`, `WordCountValidator.tsx`, and all custom hooks in `src/components/hooks/` (e.g., `useMyCards`, `useReviewView`, `useStudyView`).
  - **Testing Focus:**
    - **Hooks:** Unit tests using `@testing-library/react-hooks` (or similar Vitest-compatible approach) to verify state management, side effects, and return values in isolation. Mock all external dependencies.
    - **Components:** Integration tests focusing on their specific interactive behavior, prop handling, and rendering based on different states.
  - **Coverage Target:** 70-85% statement, branch, and function coverage.

- **Category C: Presentational UI Components (Lower Priority)**
  - **Description:** Simple, stateless or minimally stateful components primarily responsible for rendering UI based on props. These often come from UI libraries (like `shadcn/ui` components).
  - **Examples:** `alert-dialog.tsx`, `alert.tsx`, `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `sheet.tsx`, `GenerationLoadingOverlay.tsx`, `ReviewCompletion.tsx`.
  - **Testing Focus:** Basic snapshot tests (if desired for visual consistency, though generally avoided for pure unit tests) and simple render tests to ensure they mount without errors and display correct props. Focus on conditional rendering if any.
  - **Coverage Target:** 50-70% statement coverage (primarily for conditional rendering logic).

#### 2. Testing Levels: Unit and Integration Tests

The project will primarily focus on **Unit Tests** and **Integration Tests** for frontend components.

- **Unit Tests:**
  - **Purpose:** To test individual functions, classes, or hooks in isolation, ensuring their internal logic works as expected. Dependencies are heavily mocked.
  - **Tools:** Vitest, `@testing-library/react-hooks` (or equivalent for hooks).
  - **Application:** Primarily for custom hooks (`src/components/hooks/`) and complex utility functions within components.
  - **Example:** Testing `useLogin` hook to ensure it calls the authentication service correctly and updates loading/error states.

- **Integration Tests (Component Level):**
  - **Purpose:** To test how multiple units (e.g., a component and its child components, or a component and a custom hook it uses) work together, simulating user interaction and verifying the component's behavior from a user's perspective.
  - **Tools:** Vitest, React Testing Library (`@testing-library/react`), `@testing-library/jest-dom`.
  - **Application:** All Category A and B components.
  - **Example:** Testing `LoginForm.tsx` by simulating typing into input fields, clicking the submit button, and asserting that the login function (mocked) is called and the UI updates (e.g., shows a success message or error).

- **End-to-End (E2E) Tests:**
  - **Current Status:** No E2E tests are currently planned or implemented.
  - **Recommendation:** While not part of this immediate plan, E2E tests (using tools like Playwright or Cypress) would be beneficial for verifying critical user flows across the entire application (frontend to backend). These would be a separate phase of testing.

#### 3. Mocking Strategies for Frontend Components

- **MSW (Mock Service Worker):**
  - **Purpose:** For intercepting and mocking actual network requests made by components (e.g., `fetch` calls to Astro API routes or external AI services). This provides a highly realistic testing environment without needing a live backend.
  - **Implementation:** Define request handlers in `src/__tests__/mocks/handlers.ts` for specific API endpoints. Start the MSW server in `setupTests.ts` (or `beforeAll` in test files) and reset handlers in `afterEach`.
  - **Example:** Mocking the `/api/flashcards/generate` endpoint to return a predefined set of flashcards when `CreateView.tsx` attempts to generate them.

- **Supabase Client Mocking:**
  - **Purpose:** For components or hooks that directly interact with the Supabase client (`supabase.client.ts`).
  - **Implementation:** Use `vi.mock` to mock the `supabase.client.ts` module or specific methods of the Supabase client instance. This allows controlling the return values of Supabase operations (e.g., `signInWithPassword`, `from('table').select()`).
  - **Example:** Mocking `supabase.auth.signInWithPassword` in `useLogin.test.ts` to simulate successful login or authentication errors.

- **React Context Mocking:**
  - **Purpose:** For components that consume values from React Context (e.g., an `AuthContext`).
  - **Implementation:** Create a test utility that renders the component wrapped in a mock context provider. This provider will supply controlled values (e.g., `user: null` for logged out, `user: { id: '123' }` for logged in).

#### 4. Testing User Interactions and Error Handling

- **User Interactions:**
  - **Focus:** Prioritize testing interactions that change component state, trigger data fetching, or lead to navigation.
  - **Methods:** Use `fireEvent` or `userEvent` from React Testing Library to simulate events like `click`, `change`, `submit`. `userEvent` is generally preferred as it more closely mimics real browser interactions.
  - **Assertions:** Assert that the UI updates correctly, functions are called with expected arguments, or navigation occurs.

- **Error Handling:**
  - **Focus:** Crucial for robust applications. Test scenarios where API calls fail, invalid data is provided, or unexpected errors occur.
  - **Methods:**
    - **Mocking:** Configure MSW or Supabase mocks to return error responses.
    - **Simulate Errors:** For synchronous logic, directly throw errors within mocked functions.
    - **Assertions:** Assert that error messages are displayed to the user, fallback UI is rendered, or appropriate error logging occurs.

#### 5. Test Structure and Organization (Reinforced)

- **Directory Structure:** Test files will continue to be placed in a `__tests__` directory parallel to the `src` directory, mirroring the `src` folder structure.
  - Example: `src/components/views/auth/LoginForm.tsx` will have its tests in `src/__tests__/components/views/auth/LoginForm.test.tsx`.
- **Naming Conventions:**
  - Test files: `[ComponentName].test.tsx` for React components.
  - Test suites: `describe('ComponentName', () => { ... });`.
  - Test cases: `it('should render correctly', () => { ... });`, `it('should handle form submission', async () => { ... });`.

#### 6. Implementation Phases (Updated)

The existing implementation phases will be updated to reflect the detailed frontend component testing plan.

- **Phase 1: Setup & Core Utilities (Estimated: 1 week)**
  - Set up Vitest, React Testing Library, Supertest, and MSW.
  - Configure `vitest.config.ts`.
  - Write unit tests for `src/lib/utils.ts`.
  - Establish basic mocking patterns for Supabase client and external AI service.
  - **Add:** Set up React Context mocking utilities.
- **Phase 2: Core Services & Data Layer (Estimated: 2 weeks)**
  - Develop comprehensive unit tests for `src/lib/services/flashcard.service.ts`, mocking `supabase.client.ts`.
  - Develop comprehensive unit tests for `src/lib/services/ai.service.ts`, mocking the external AI API calls using MSW.
- **Phase 3: API Routes & Authentication Hooks (Estimated: 3 weeks)**
  - Write API endpoint tests for all routes in `src/pages/api/**/*.ts` using Supertest, mocking underlying services.
  - Implement unit tests for all authentication-related hooks in `src/components/hooks/` (e.g., `useLogin`, `useRegister`, `useDeleteAccount`), mocking Supabase Auth client interactions.
- **Phase 4: UI Components & Views (Estimated: 4 weeks)**
  - **Update:** Develop integration tests for **Category A: Critical Views & Forms** (e.g., `CreateView.tsx`, `MyCardsView.tsx`, `LoginForm.tsx`). Focus on user interactions, state changes, API call mocking (MSW/Supabase), and error handling.
  - **Update:** Develop integration tests for **Category B: Interactive Components** (e.g., `InfiniteScrollLoader.tsx`, `ManagedCard.tsx`).
  - **Add:** Develop unit tests for **Category B: Custom Hooks** (e.g., `useMyCards`, `useReviewView`).
  - **Add (Optional):** Basic render tests for **Category C: Presentational UI Components**.
- **Phase 5: Edge Cases, Error Handling & Refinement (Estimated: 1 week)**
  - Review existing tests and add tests for uncovered edge cases, error states, and less common user flows, especially for frontend components.
  - Refine test data, mocks, and assertions for clarity and robustness.
  - Integrate coverage reporting and set up CI/CD.
