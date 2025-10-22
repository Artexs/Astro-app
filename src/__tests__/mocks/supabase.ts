import { vi } from 'vitest';

const createMockQueryBuilder = () => {
  const query = {
    eq: vi.fn(() => query),
    range: vi.fn(() => query),
    single: vi.fn(),
    limit: vi.fn(() => query),
    then: vi.fn((resolve) => resolve({ data: [], error: null, count: 0 })), // Default for count
  };

  const mockSelect = vi.fn(() => query);
  const mockInsert = vi.fn(() => query);
  const mockDelete = vi.fn(() => query);

  return {
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
    ...query, // Include other query methods directly
  };
};

export const mockSupabaseClient = {
  from: vi.fn(() => createMockQueryBuilder()),
};
