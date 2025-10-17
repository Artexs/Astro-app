# API Endpoint Implementation Plan: GET /api/flashcards

## 1. Endpoint Overview
This endpoint retrieves a paginated list of all flashcards belonging to the currently authenticated user. It is designed to support features like an "infinite scroll" list on the frontend, allowing users to browse their entire collection efficiently.

## 2. Request Details
- **HTTP Method**: `GET`
- **URL Structure**: `/api/flashcards`
- **Parameters**:
  - **Required**: None
  - **Optional Query Parameters**:
    - `page` (number, default: `1`): The page number for pagination. Must be a positive integer.
    - `limit` (number, default: `30`): The number of items to return per page. Must be a positive integer.
- **Request Body**: None

## 3. Used Types
- **Response Item DTO**: `FlashcardListItemDto` from `@src/lib/types.ts`
  ```typescript
  type FlashcardListItemDto = Pick<
    Flashcard,
    "id" | "question" | "answer" | "state"
  >;
  ```
- **Input Validation Schema**: A `zod` schema will be used to validate and parse query parameters.
  ```typescript
  import { z } from 'zod';

  const querySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(30),
  });
  ```

## 4. Response Details
- **Success (200 OK)**:
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
- **Error**: See Error Handling section for details on `400`, `401`, and `500` status codes.

## 5. Data Flow
1. A `GET` request arrives at the Astro server endpoint (`/src/pages/api/flashcards/index.ts`).
2. The handler retrieves the authenticated `user` and `supabase` client from `context.locals`. If no user exists, it immediately returns a `401 Unauthorized` error.
3. The endpoint uses a `zod` schema to parse and validate the `page` and `limit` query parameters. If validation fails, it returns a `400 Bad Request` error.
4. The handler calls the `getUserFlashcards` method in the `FlashcardService` (`/src/lib/services/flashcard.service.ts`), passing the Supabase client, user ID, and validated pagination parameters.
5. The `FlashcardService` performs two database queries in parallel:
    a. A `count` query to get the `totalItems` for the user.
    b. A `select` query with a `.range()` filter to fetch the specific page of flashcards.
6. The service calculates the `totalPages` based on `totalItems` and `limit`.
7. The service returns an object containing the `data` (list of flashcards) and `pagination` details.
8. The endpoint handler receives the data from the service, wraps it in a `try...catch` block, and sends the final JSON response with a `200 OK` status.

## 6. Security Considerations
- **Authentication**: The endpoint is protected and requires a valid JWT. The Astro middleware populates `context.locals.supabase`, and the handler will reject any request without an authenticated user session, returning `401 Unauthorized`.
- **Authorization**: Data access is secured by PostgreSQL's Row-Level Security (RLS) policies, as defined in the database plan. The policy `auth.uid() = user_id` ensures that all queries executed by the `FlashcardService` are automatically scoped to the authenticated user, preventing any possibility of one user accessing another user's data.

## 7. Error Handling
- **400 Bad Request**: Returned if the `page` or `limit` query parameters fail validation (e.g., are not positive integers). The response body will contain a descriptive error message from Zod.
- **401 Unauthorized**: Returned if the request lacks a valid `Authorization` header with a Supabase JWT, or the user's session is expired.
- **500 Internal Server Error**: Returned for any unexpected server-side exceptions, such as a database connection failure. Errors will be logged to the console for debugging, but a generic error message will be sent to the client.

## 8. Performance Considerations
- **Indexing**: The query performance relies on the `ix_flashcards_user_id` index on the `flashcards.user_id` column. This is critical for efficiently fetching both the count and the data for a specific user.
- **Pagination Query**: The use of `count()` followed by a `range()` query is a standard pagination pattern. While `count()` can be slow on extremely large tables (billions of rows), it is perfectly acceptable and performant for the scale of this application.

## 9. Implementation Steps
1.  **Create Service File**: Create a new file at `/src/lib/services/flashcard.service.ts`.
2.  **Implement `FlashcardService`**:
    -   Define and export a `getUserFlashcards` function within the service file.
    -   This function will accept `supabase`, `userId`, `page`, and `limit` as arguments.
    -   Inside the function, execute the Supabase queries to get the total count and the paginated data.
    -   Calculate pagination details and return the structured response.
3.  **Update API Route**: Modify the file `/src/pages/api/flashcards/index.ts`.
4.  **Implement `GET` Handler**:
    -   Define an `export const GET: APIRoute = async ({ request, context }) => { ... }`.
    -   Define the `zod` schema for query parameter validation.
    -   Get the `supabase` client and `session` from `context.locals`. Return `401` if the session or user is missing.
    -   Use a `try...catch` block for validation. Parse the URL's query parameters using the schema. On failure, return `400` with the Zod error.
    -   Use another `try...catch` block to call the `flashcardService.getUserFlashcards` method.
    -   On success, return a `200 OK` response with the data from the service.
    -   In the `catch` block, log the error and return a `500 Internal Server Error` response.
