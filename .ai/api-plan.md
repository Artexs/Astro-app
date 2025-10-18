# REST API Plan

This document outlines the REST API for the AI Flashcard Generator, designed based on the project's PRD, database schema, and tech stack. The API is built using Astro API routes and secured via Supabase authentication.

## 1. Resources

-   **Flashcard**: Represents a single user-owned flashcard.
    -   *Database Table*: `public.flashcards`

## 2. Endpoints

All endpoints are prefixed with `/api` and require authentication.

---

### Flashcard Generation

#### `POST /api/flashcards/generate`

-   **Description**: Generates a list of potential flashcards from a block of text using an external AI service. The returned cards are not saved to the database; they are for client-side review only.
-   **Request Payload**:
    ```json
    {
      "text": "A long piece of text between 1,000 and 10,000 words..."
    }
    ```
-   **Response Payload (Success)**:
    ```json
    {
      "data": [
        {
          "question": "What is the capital of France?",
          "answer": "Paris"
        },
        {
          "question": "What is the formula for water?",
          "answer": "H2O"
        }
      ]
    }
    ```
-   **Success Code**: `200 OK`
-   **Error Codes**:
    -   `400 Bad Request`: If the text is missing, not a string, or outside the 1,000-10,000 word count limit.
    -   `401 Unauthorized`: If the user is not authenticated.
    -   `500 Internal Server Error`: If the AI service fails or an unexpected error occurs.

---

### Flashcard Management

#### `POST /api/flashcards`

-   **Description**: Creates and saves a new flashcard to the user's collection. This is called when a user "Accepts" a card during the review process.
-   **Request Payload**:
    ```json
    {
      "question": "What is the capital of France?",
      "answer": "Paris"
    }
    ```
-   **Response Payload (Success)**:
    ```json
    {
      "data": {
        "id": 1,
        "user_id": "user-uuid-goes-here",
        "question": "What is the capital of France?",
        "answer": "Paris",
        "due": "2025-10-17T12:00:00Z",
        "stability": 0,
        "difficulty": 0,
        "lapses": 0,
        "state": "new"
      },
      "message": "Flashcard created successfully."
    }
    ```
-   **Success Code**: `201 Created`
-   **Error Codes**:
    -   `400 Bad Request`: If `question` or `answer` are missing or empty.
    -   `401 Unauthorized`: If the user is not authenticated.

#### `GET /api/flashcards`

-   **Description**: Retrieves all flashcards belonging to the authenticated user. Supports pagination for infinite scroll.
-   **Query Parameters**:
    -   `page` (optional, default: `1`): The page number to retrieve.
    -   `limit` (optional, default: `30`): The number of items per page.
-   **Response Payload (Success)**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "question": "What is the capital of France?",
          "answer": "Paris",
          "state": "new"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 150
      }
    }
    ```
-   **Success Code**: `200 OK`
-   **Error Codes**:
    -   `400 Bad Request`: If `page` or `limit` are not positive integers.
    -   `401 Unauthorized`: If the user is not authenticated.

#### `DELETE /api/flashcards/{id}`

-   **Description**: Permanently deletes a specific flashcard from the user's collection.
-   **URL Parameters**:
    -   `id`: The unique identifier of the flashcard to delete.
-   **Response Payload (Success)**:
    ```json
    {
      "message": "Flashcard deleted successfully."
    }
    ```
-   **Success Code**: `200 OK` or `204 No Content`
-   **Error Codes**:
    -   `401 Unauthorized`: If the user is not authenticated.
    -   `403 Forbidden`: If the user tries to delete a flashcard they do not own.
    -   `404 Not Found`: If no flashcard with the given `id` exists.

---

### Study

#### `GET /api/flashcards/study/random`

-   **Description**: Retrieves a single random flashcard from the user's collection for a study session.
-   **Response Payload (Success)**:
    ```json
    {
      "data": {
        "id": 42,
        "question": "What is the powerhouse of the cell?",
        "answer": "The mitochondria"
      }
    }
    ```
-   **Success Code**: `200 OK`
-   **Error Codes**:
    -   `401 Unauthorized`: If the user is not authenticated.
    -   `404 Not Found`: If the user has no flashcards in their collection.

## 3. Authentication and Authorization

-   **Mechanism**: Authentication is handled using JSON Web Tokens (JWTs) provided by Supabase Auth.
-   **Implementation**:
    1.  The client (frontend) obtains a JWT from Supabase upon user login.
    2.  For every request to the API endpoints, the client must include the JWT in the `Authorization` header: `Authorization: Bearer <SUPABASE_JWT>`.
    3.  The Astro API route backend will use the Supabase client library to verify the JWT. If the token is valid, the user's identity is established.
-   **Authorization**: Data access is controlled by PostgreSQL's Row-Level Security (RLS) policies, as defined in the database plan. The policies ensure that a user can only perform `SELECT`, `INSERT`, `UPDATE`, or `DELETE` operations on flashcards where the `user_id` column matches their authenticated user ID (`auth.uid()`).

## 4. Validation and Business Logic

-   **Flashcard Generation (`POST /api/flashcards/generate`)**:
    -   **Validation**: The API will validate that the `text` field in the request payload contains between 1,000 and 10,000 words.
    -   **Business Logic**: This endpoint encapsulates the interaction with the external AI service. It is responsible for securely sending the text and processing the AI's response into a clean `question`/`answer` format.

-   **Flashcard Creation (`POST /api/flashcards`)**:
    -   **Validation**: The API enforces that the `question` and `answer` fields are not null or empty, as required by the `NOT NULL` constraint in the database schema.

-   **Pagination (`GET /api/flashcards`)**:
    -   **Business Logic**: To support the "infinite scroll" feature, this endpoint uses `page` and `limit` query parameters to calculate the `OFFSET` for the SQL query, allowing the frontend to fetch cards in chunks.

-   **Random Card Selection (`GET /api/flashcards/study/random`)**:
    -   **Business Logic**: The API will use a database query with `ORDER BY random() LIMIT 1` to efficiently select a random flashcard from the user's collection, as specified in the database plan.

## 5. User Account & Session Management

This section details how user authentication, session management, and account operations are handled. The implementation primarily relies on the Supabase client-side library (`@supabase/supabase-js`) for security and simplicity, which aligns with the project's tech stack.

### 5.1. Client-Side Authentication Flow

The following operations are performed on the frontend using the Supabase JS library. The library securely communicates with the Supabase backend to manage user sessions and returns a JWT, which is then used to authenticate with this API's endpoints (as described in Section 3).

-   **User Sign-Up**: The client application will call `supabase.auth.signUp({ email, password })`. Supabase handles the account creation and the email verification flow.
-   **User Login**: The client application will call `supabase.auth.signInWithPassword({ email, password })`. On success, Supabase returns a session object containing the JWT needed for API requests.
-   **User Logout**: The client application will call `supabase.auth.signOut()`. This invalidates the user's session and removes the JWT from the client's storage.
-   **Password Management**:
    -   **Password Reset (Forgot Password)**: The flow is initiated on the client by calling `supabase.auth.resetPasswordForEmail()`.
    -   **Change Password**: A logged-in user can change their password via the client-side `supabase.auth.updateUser()` method.

### 5.2. Account Deletion

-   **Implementation Note**: The PRD requires a feature for users to permanently delete their account and all associated data. Securely and automatically deleting a user from `auth.users` requires administrative privileges and **must be performed in a trusted server environment**.
-   **Action**: A backend endpoint (`DELETE /api/account`) will be necessary to handle account deletion requests securely.
