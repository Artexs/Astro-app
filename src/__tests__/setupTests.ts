import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Example MSW handlers (you'll need to add your actual API handlers here)
export const handlers = [
  http.get('https://api.example.com/data', () => {
    return HttpResponse.json({ message: 'Mocked data' });
  }),
  // Add more handlers for Supabase, AI service, etc.
];

export const server = setupServer(...handlers);

// Start the server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-off error cases):
afterEach(() => server.resetHandlers());

// Stop the server after all tests
afterAll(() => server.close());