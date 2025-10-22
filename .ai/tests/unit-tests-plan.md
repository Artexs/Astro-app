# Unit Testing Implementation Plan for AI Flashcard Generator

## Project Understanding

### Core Functionality and Features
The AI Flashcard Generator is a web application that automates flashcard creation from user-provided text. Key features include:
-   **User Authentication & Account Management:** Sign-up, login, logout, password reset, account page (change password, delete account) via Supabase Auth.
-   **Flashcard Generation:** Users input text (1,000-10,000 words), which is sent to a backend API (`/api/flashcards/generate`) to an external AI service for generating question/answer flashcards.
-   **Flashcard Review:** Users review generated cards, accepting or rejecting them. Accepted cards are saved to the user's collection.
-   **Card Management:** A "My Cards" dashboard (`/my-cards`) displays user's flashcards with infinite scroll and deletion functionality.
-   **Study Module:** A minimalist study interface (`/study`) fetches random cards for review.
-   **Navigation & Layout:** Consistent header/footer with authenticated/unauthenticated navigation states.

### Technology Stack, Frameworks, and Tools
-   **Frontend:** Astro (web framework, SSR), React (interactive UI components), TypeScript, Tailwind CSS.
-   **Backend & Database:** Supabase (BaaS: Auth, PostgreSQL Database with Row Level Security), Astro API Routes (serverless endpoints).
-   **AI:** External AI Service (TBD, e.g., OpenAI, Google Gemini) integrated via backend API routes.
-   **Development & Tooling:** Node.js, ESLint, Prettier.

### Project Structure and Architecture
The project follows a component-based architecture with clear separation of concerns:
-   `src/layouts/`: Astro layouts for consistent page structure.
-   `src/pages/`: Astro pages for routing, including `api/` for backend endpoints.
-   `src/components/`: UI components, further organized into `hooks/`, `layout/`, `ui/`, and `views/`.
-   `src/lib/`: Contains `types.ts`, `utils.ts`, and `services/` (e.g., `ai.service.ts`, `flashcard.service.ts`) for business logic and external integrations.
-   `src/db/`: Supabase client and database types.

### Key Components, Modules, and Services
-   **Authentication Hooks:** `useLogin`, `useRegister`, `useChangePassword`, `useForgotPassword`, `useResetPassword`, `useDeleteAccount` (in `src/components/hooks/`).
-   **Flashcard Services:** `flashcard.service.ts` (CRUD operations for flashcards), `ai.service.ts` (interface with external AI).
-   **API Routes:** `src/pages/api/flashcards/generate.ts`, `src/pages/api/flashcards/index.ts` (GET/POST), `src/pages/api/flashcards/[id].ts` (DELETE), `src/pages/api/flashcards/study/random.ts`.
-   **React Views:** `AccountView.tsx`, `CreateView.tsx`, `MyCardsView.tsx`, `ReviewView.tsx`, `StudyView.tsx`, and their sub-components.
-   **Utility Functions:** `src/lib/utils.ts`.
-   **Supabase Client:** `src/db/supabase.client.ts`.

### Dependencies and Integrations
-   **Supabase:** Core dependency for authentication and database.
-   **External AI Service:** Critical for flashcard generation.
-   **React:** For interactive UI.
-   **Astro:** For routing, SSR, and API layer.

## Unit Testing Strategy

### 1. Testing Framework Selection
-   **Frontend (React components, hooks, utilities):**
    -   **Vitest:** Chosen for its speed, native TypeScript support, and excellent integration with Vite (which Astro uses). It provides a Jest-compatible API, making it familiar for many developers.
    -   **React Testing Library:** For testing React components. It encourages testing components the way users interact with them, focusing on accessibility and user-facing behavior rather than internal implementation details.
-   **Backend (Astro API routes, services, utility functions):**
    -   **Vitest:** Will be used for testing Node.js-based service logic and utility functions.
    -   **Supertest:** For testing Astro API routes. It allows for making HTTP assertions against API endpoints, simulating actual requests without needing to run a full server.
-   **Additional Utilities:**
    -   **`@testing-library/jest-dom`:** Provides custom Jest matchers for more expressive DOM assertions.
    -   **`msw` (Mock Service Worker):** For mocking network requests (e.g., to the external AI service or Supabase API) in both frontend and backend tests, providing realistic and reliable test environments.

### 2. Test Coverage Strategy
-   **Critical Components for Unit Testing:**
    -   **Business Logic Services:** `src/lib/services/flashcard.service.ts`, `src/lib/services/ai.service.ts`. These contain the core application logic and interactions with external systems.
    -   **React Hooks:** All hooks in `src/components/hooks/` (e.g., `useLogin`, `useMyCards`) as they encapsulate complex state management, side effects, and data fetching logic.
    -   **Astro API Route Handlers:** All files in `src/pages/api/**/*.ts`. These are the entry points for backend logic and handle request parsing, validation, and service orchestration.
    -   **Utility Functions:** `src/lib/utils.ts` for any helper functions.
    -   **Complex UI Logic:** Components with significant state, user interaction, or conditional rendering (e.g., `WordCountValidator.tsx`, `GenerationLoadingOverlay.tsx`, `ConfirmationModal.tsx`).
-   **Coverage Targets and Priorities:**
    -   **High Priority (90%+ coverage):** All service files (`src/lib/services/`), React hooks (`src/components/hooks/`), and API route handlers (`src/pages/api/`). These layers are crucial for application correctness and stability.
    -   **Medium Priority (70%+ coverage):** Complex React components/views that contain significant logic or user interaction flows.
    -   **Low Priority (Optional):** Simple presentational components (e.g., basic `ui/` components) that primarily render props without complex logic.
-   **What Should and Shouldn't Be Unit Tested:**
    -   **Should Test:**
        -   Functionality of service methods (e.g., `flashcard.service.createCard` saves correctly).
        -   Logic within React hooks (e.g., `useLogin` handles success, error, loading states).
        -   API route request parsing, validation, calling correct services, and response formatting.
        -   Input validation logic (e.g., word count).
        -   Component behavior based on props and user interactions (e.g., form submission, button clicks, conditional rendering).
        -   Error handling and edge cases (e.g., API failures, invalid input, empty data sets).
    -   **Should NOT Unit Test:**
        -   Third-party library internals (e.g., Supabase client's internal workings, React's rendering engine).
        -   Visual aspects or simple CSS styling (Tailwind CSS).
        -   Full end-to-end user flows (these are for integration/E2E tests).
        -   Astro's core routing or SSR mechanisms.

### 3. Test Structure and Organization
-   **Directory Structure:** Test files will be placed in a `__tests__` directory parallel to the `src` directory, mirroring the `src` folder structure.
    -   Example: `src/lib/services/flashcard.service.ts` will have its tests in `src/__tests__/lib/services/flashcard.service.test.ts`.
    -   Example: `src/components/hooks/useLogin.ts` will have its tests in `src/__tests__/components/hooks/useLogin.test.ts`.
    -   Example: `src/pages/api/flashcards/generate.ts` will have its tests in `src/__tests__/pages/api/flashcards/generate.test.ts`.
-   **Naming Conventions:**
    -   Test files: `[filename].test.ts` or `[filename].test.tsx`.
    -   Test suites: Use `describe('ComponentName or ModuleName', () => { ... });`.
    -   Test cases: Use `it('should do something specific when...', () => { ... });` or `test('should do something specific when...', () => { ... });`.
-   **Organization Relative to Source Code:** This parallel `__tests__` directory approach keeps test files separate from source code while maintaining a clear mapping, making it easy to locate tests for any given source file.

### 4. Implementation Phases
-   **Phase 1: Setup & Core Utilities (Estimated: 1 week)**
    -   Set up Vitest, React Testing Library, Supertest, and MSW.
    -   Configure `vitest.config.ts`.
    -   Write unit tests for `src/lib/utils.ts`.
    -   Establish basic mocking patterns for Supabase client and external AI service.
-   **Phase 2: Core Services & Data Layer (Estimated: 2 weeks)**
    -   Develop comprehensive unit tests for `src/lib/services/flashcard.service.ts`, mocking `supabase.client.ts`.
    -   Develop comprehensive unit tests for `src/lib/services/ai.service.ts`, mocking the external AI API calls using MSW.
-   **Phase 3: API Routes & Authentication Hooks (Estimated: 3 weeks)**
    -   Write API endpoint tests for all routes in `src/pages/api/**/*.ts` using Supertest, mocking underlying services.
    -   Implement unit tests for all authentication-related hooks in `src/components/hooks/` (e.g., `useLogin`, `useRegister`, `useDeleteAccount`), mocking Supabase Auth client interactions.
-   **Phase 4: UI Components & Views (Estimated: 4 weeks)**
    -   Develop unit tests for key React components in `src/components/views/` that contain significant logic or user interaction (e.g., `CreateView.tsx`, `MyCardsView.tsx`, `ReviewView.tsx`, `StudyView.tsx`). Focus on user interactions, state changes, and conditional rendering.
    -   Test specific validation components like `WordCountValidator.tsx`.
-   **Phase 5: Edge Cases, Error Handling & Refinement (Estimated: 1 week)**
    -   Review existing tests and add tests for uncovered edge cases, error states, and less common user flows.
    -   Refine test data, mocks, and assertions for clarity and robustness.
    -   Integrate coverage reporting and set up CI/CD.

### 5. Testing Patterns and Best Practices
-   **Arrange-Act-Assert (AAA):** Each test should clearly define its setup (Arrange), the action being tested (Act), and the expected outcome (Assert).
-   **Mocking/Stubbing Strategies:**
    -   **Module Mocks (`vitest.mock`):** Use for mocking entire modules like `src/db/supabase.client.ts` or `src/lib/services/ai.service.ts` to isolate the unit under test from its dependencies.
    -   **Function Mocks (`vi.fn()`):** For mocking individual functions or methods within a module.
    -   **Network Mocks (`msw`):** Crucial for simulating API responses from Supabase and the external AI service, ensuring tests are fast, reliable, and independent of actual network calls.
    -   **React Hook Mocks:** When testing components that consume custom hooks, mock the hook's return values to control its behavior.
-   **Test Data Management:**
    -   Create small, representative test data sets.
    -   Use factory functions or builder patterns for generating complex test data (e.g., flashcard objects, user profiles) to ensure consistency and reduce boilerplate.
    -   Avoid hardcoding large JSON objects directly in tests.
-   **Setup and Teardown Procedures:**
    -   Use `beforeEach` and `afterEach` to set up and clean up the test environment for each test (e.g., resetting mocks, cleaning up DOM with `@testing-library/react/cleanup`).
    -   Use `beforeAll` and `afterAll` for global setup/teardown (e.g., starting/stopping MSW server).
-   **Testing Library Principles:** Prioritize testing user interactions and visible output over internal component state or method calls. Use queries like `getByRole`, `getByText`, `findByText` to interact with the DOM.

### 6. Specific Test Categories
-   **Unit Tests for Business Logic:**
    -   Verify `flashcard.service.ts` methods correctly interact with the mocked Supabase client (e.g., `createCard`, `getCards`, `deleteCard`).
    -   Ensure `ai.service.ts` correctly formats requests to the mocked external AI service and parses its responses.
    -   Test `src/lib/utils.ts` functions for correctness and edge cases.
-   **API Endpoint Testing:**
    -   Use Supertest to send requests to Astro API routes (e.g., `POST /api/flashcards/generate`, `GET /api/flashcards`).
    -   Assert correct HTTP status codes, response bodies, and error messages.
    -   Verify input validation on API routes.
    -   Ensure API routes correctly call and handle responses from mocked services.
-   **Database Interaction Testing:**
    -   Focus on ensuring the `flashcard.service.ts` and other data-access layers correctly construct and execute Supabase client calls. The actual database logic (RLS, triggers) should be covered by integration/E2E tests, not unit tests. Mock the Supabase client.
-   **Component/Module Integration Points:**
    -   Test React components' interactions with custom hooks (mocking hook return values).
    -   Test how components handle data fetched from services (mocking service responses).
-   **Error Handling and Edge Cases:**
    -   Test scenarios where external APIs fail (e.g., AI service returns an error, Supabase is unreachable).
    -   Test invalid user inputs (e.g., text outside word count limits).
    -   Test empty states (e.g., `MyCardsView` with no cards).
    -   Test unauthorized access attempts to protected resources.

### 7. CI/CD Integration
-   **Build Pipeline Integration:**
    -   Add an `npm run test` script (which will execute `vitest run --coverage`) to the CI pipeline.
    -   Tests should run automatically on every pull request and commit to the main branch.
-   **Test Execution Strategies:**
    -   Run all unit tests in a dedicated CI job.
    -   Consider parallelizing test execution for faster feedback.
-   **Coverage Reporting and Quality Gates:**
    -   Configure Vitest to generate coverage reports (e.g., using `c8` or `istanbul` reporters).
    -   Set minimum coverage thresholds in `vitest.config.ts` (e.g., 80% statements, branches, functions, lines).
    -   Fail the CI build if coverage falls below the defined thresholds, acting as a quality gate.
    -   Integrate with a coverage reporting service (e.g., Codecov, Coveralls) for historical tracking and pull request comments.

### 8. Tooling and Configuration
-   **Required Configuration Files:**
    -   `vitest.config.ts`: Main configuration for Vitest, including test environment, reporters, coverage thresholds, and aliases.
    -   `setupTests.ts` (or similar): For global test setup (e.g., importing `@testing-library/jest-dom`, initializing MSW).
-   **IDE Setup Recommendations:**
    -   **VS Code:** Install the "Vitest" extension for running and debugging tests directly from the editor, viewing test results inline, and getting real-time feedback.
    -   Ensure TypeScript is correctly configured for test files.
-   **Debugging and Troubleshooting Approaches:**
    -   Use the IDE's built-in debugger with Vitest for step-through debugging.
    -   Utilize `console.log` statements within tests and components for quick inspection.
    -   Leverage Vitest's watch mode (`vitest --watch`) for rapid feedback during development.
    -   Use `screen.debug()` from React Testing Library to inspect the rendered DOM in component tests.