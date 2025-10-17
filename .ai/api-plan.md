# REST API Plan

This document outlines the REST API for the AI Flashcard Generator, designed to support the features defined in the PRD and leverage the specified tech stack (Astro, Supabase).

## 1. Resources

-   **Flashcards**: Represents the user-generated flashcards.
    -   Database Table: `public.flashcards`
-   **User**: Represents the authenticated user.
    -   Database Table: `auth.users` (managed by Supabase)

## 2. Endpoints

### Flashcard Generation

This endpoint handles the core AI-powered generation feature.

-   **HTTP Method**: `POST`
-   **URL Path**: `/api/flashcards/generate`
-   **Description**: Accepts a block of text, sends it to an external AI service, and returns a list of generated (but not yet saved) question-and-answer pairs.
-   **Request Payload**:
    ```json
    {
      "text": "A long string of text between 1,000 and 10,000 words..."
    }
    ```
-   **Response Payload (Success)**:
    ```json
    {
      "data": [
        {
          "question": "What is the primary web framework used?",
          "answer": "Astro is the primary web framework."
        },
        {
          "question": "What is React used for?",
          "answer": "Building interactive UI components."
        }
      ]
    }
    ```
-   **Success Codes**:
    -   `200 OK`: Successfully generated flashcards.
-   **Error Codes**:
    -   `400 Bad Request`: The provided text is outside the 1,000-10,000 word limit.
    -   `401 Unauthorized`: User is not authenticated.
    -   `500 Internal Server Error`: An error occurred with the external AI service.

---

### Flashcard Management (CRUD)

These endpoints follow standard REST conventions for managing the `flashcards` resource.

#### Create a Flashcard

-   **HTTP Method**: `POST`
-   **URL Path**: `/api/flashcards`
-   **Description**: Creates and saves a new flashcard to the user's collection. This is called when a user "Accepts" a card during the review process. A batch endpoint (`POST /api/flashcards/batch`) is recommended for performance but this single-creation endpoint is the fundamental operation.
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
        "due": "2025-10-14T12:00:00Z",
        "stability": 0,
        "difficulty": 0,
        "lapses": 0,
        "state": "new"
      }
    }
    ```
-   **Success Codes**:
    -   `201 Created`: The flashcard was successfully created.
-   **Error Codes**:
    -   `400 Bad Request`: The request payload is missing `question` or `answer`.
    -   `401 Unauthorized`: User is not authenticated.

#### Get All User Flashcards

-   **HTTP Method**: `GET`
-   **URL Path**: `/api/flashcards`
-   **Description**: Retrieves all flashcards belonging to the authenticated user. Supports pagination for infinite scroll.
-   **Query Parameters**:
    -   `limit` (integer, optional, default: 20): The number of flashcards to return.
    -   `offset` (integer, optional, default: 0): The starting point from which to return flashcards.
-   **Response Payload (Success)**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "question": "What is the capital of France?",
          "answer": "Paris",
          "state": "new"
        },
        {
          "id": 2,
          "question": "What is 2 + 2?",
          "answer": "4",
          "state": "review"
        }
      ],
      "meta": {
        "total": 150,
        "limit": 20,
        "offset": 0
      }
    }
    ```
-   **Success Codes**:
    -   `200 OK`: Successfully retrieved the list of flashcards.
-   **Error Codes**:
    -   `401 Unauthorized`: User is not authenticated.

#### Delete a Flashcard

-   **HTTP Method**: `DELETE`
-   **URL Path**: `/api/flashcards/{id}`
-   **Description**: Permanently deletes a specific flashcard from the user's collection.
-   **Response Payload (Success)**:
    -   Empty response body.
-   **Success Codes**:
    -   `204 No Content`: The flashcard was successfully deleted.
-   **Error Codes**:
    -   `401 Unauthorized`: User is not authenticated.
    -   `403 Forbidden`: User is trying to delete a flashcard that does not belong to them.
    -   `404 Not Found`: No flashcard with the given `id` exists.

---

### Study Module

-   **HTTP Method**: `GET`
-   **URL Path**: `/api/flashcards/random`
-   **Description**: Retrieves a single, random flashcard from the user's collection for a study session.
-   **Response Payload (Success)**:
    ```json
    {
      "data": {
        "id": 42,
        "question": "What is the powerhouse of the cell?",
        "answer": "The mitochondria",
        "state": "review"
      }
    }
    ```
-   **Success Codes**:
    -   `200 OK`: Successfully retrieved a random flashcard.
-   **Error Codes**:
    -   `401 Unauthorized`: User is not authenticated.
    -   `404 Not Found`: The user has no flashcards in their collection.

---

### User Account Management

-   **HTTP Method**: `DELETE`
-   **URL Path**: `/api/user`
-   **Description**: Deletes the authenticated user's account and all associated data (including all their flashcards via the `on_auth_user_deleted` trigger). This endpoint acts as a secure wrapper around the Supabase Admin API for user deletion.
-   **Response Payload (Success)**:
    -   Empty response body.
-   **Success Codes**:
    -   `204 No Content`: The user account was successfully deleted.
-   **Error Codes**:
    -   `401 Unauthorized`: User is not authenticated.
    -   `500 Internal Server Error`: Failed to delete the user from Supabase.

## 3. Authentication and Authorization

-   **Authentication Mechanism**: Authentication will be handled using JSON Web Tokens (JWTs) provided by **Supabase Auth**. The client-side application is responsible for acquiring, storing, and refreshing these tokens.
-   **Implementation**: Every request to a protected API endpoint must include an `Authorization` header with a Bearer token:
    `Authorization: Bearer <SUPABASE_JWT>`
-   **Authorization**: Authorization is enforced at the database level by **PostgreSQL Row-Level Security (RLS)**. The policy `Users can manage their own flashcards` ensures that all queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) on the `flashcards` table are automatically scoped to the `user_id` matching the authenticated user's `auth.uid()`. This prevents users from accessing or modifying another user's data.

## 4. Validation and Business Logic

-   **Flashcard Generation (`POST /api/flashcards/generate`)**:
    -   Validates that the input `text` has a word count between 1,000 and 10,000 words.
-   **Flashcard Creation (`POST /api/flashcards`)**:
    -   Validates that `question` and `answer` fields are present and are not empty strings.
    -   The `user_id` is not part of the request body; it is extracted from the authenticated user's JWT on the server to ensure a user can only create flashcards for themselves.
-   **Random Card Selection (`GET /api/flashcards/random`)**:
    -   The business logic for selecting a random card will be implemented using the `ORDER BY random() LIMIT 1` SQL clause, as specified in the database plan.
-   **User Deletion (`DELETE /api/user`)**:
    -   The business logic for cascading deletes (removing all of a user's flashcards upon account deletion) is handled by the `handle_user_deletion` PostgreSQL trigger in the database. The API's role is simply to initiate the user deletion process via Supabase.
