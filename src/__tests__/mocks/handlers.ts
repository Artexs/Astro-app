import { http, HttpResponse } from 'msw';

export const handlers = [
  // Placeholder for Supabase and AI service mocks
  http.get('https://api.example.com/data', () => {
    return HttpResponse.json({ message: 'Mocked data' });
  }),
];