import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreateView from '~/components/views/create/CreateView';
import { server } from '~/__tests__/mocks/server';
import { HttpResponse, http } from 'msw';

// Mock child components to isolate CreateView's logic
vi.mock('~/components/views/create/WordCountValidator', () => ({
  default: ({ wordCount, min, max }) => (
    <div data-testid="word-count-validator">
      Word Count: {wordCount} (Min: {min}, Max: {max})
    </div>
  ),
}));

vi.mock('~/components/views/create/GenerationLoadingOverlay', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="loading-overlay">Loading...</div> : null),
}));

// Mock sessionStorage and window.location.href
const sessionStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

const originalLocation = window.location;
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { href: originalLocation.href },
});

describe('CreateView', () => {
  beforeEach(() => {
    // Reset mocks before each test
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.clear.mockClear();
    window.location.href = originalLocation.href; // Reset href
    server.resetHandlers();
  });

  it('should render the create view correctly', () => {
    render(<CreateView />);

    expect(screen.getByRole('heading', { name: /create flashcards/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste your text here.../i)).toBeInTheDocument();
    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toBeDisabled();
    expect(screen.getByTestId('word-count-validator')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should enable the generate button for valid word count', () => {
    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    // Simulate text with 1000 words
    const validText = 'word '.repeat(1000).trim();
    fireEvent.change(textarea, { target: { value: validText } });

    expect(generateButton).toBeEnabled();
  });

  it('should disable the generate button for less than 1000 words', () => {
    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    const invalidText = 'word '.repeat(999).trim();
    fireEvent.change(textarea, { target: { value: invalidText } });

    expect(generateButton).toBeDisabled();
  });

  it('should disable the generate button for more than 10000 words', () => {
    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    const invalidText = 'word '.repeat(10001).trim();
    fireEvent.change(textarea, { target: { value: invalidText } });

    expect(generateButton).toBeDisabled();
  });

  it('should handle successful flashcard generation and redirect', async () => {
    const mockFlashcards = [{ question: 'Q1', answer: 'A1' }];
    server.use(
      http.post('/api/flashcards/generate', () => {
        return HttpResponse.json({ data: mockFlashcards }, { status: 200 });
      })
    );

    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    const validText = 'word '.repeat(1000).trim();
    fireEvent.change(textarea, { target: { value: validText } });
    fireEvent.click(generateButton);

    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'generatedFlashcards',
        JSON.stringify(mockFlashcards)
      );
      expect(window.location.href).toBe('/review');
    });
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
  });

  it('should display an error message if flashcard generation fails', async () => {
    const errorMessage = 'Failed to generate flashcards.';
    server.use(
      http.post('/api/flashcards/generate', () => {
        return HttpResponse.json({ error: errorMessage }, { status: 500 });
      })
    );

    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    const validText = 'word '.repeat(1000).trim();
    fireEvent.change(textarea, { target: { value: validText } });
    fireEvent.click(generateButton);

    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
  });

  it('should show loading state during generation', async () => {
    server.use(
      http.post('/api/flashcards/generate', async () => {
        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay
        return HttpResponse.json({ data: [] }, { status: 200 });
      })
    );

    render(<CreateView />);
    const textarea = screen.getByPlaceholderText(/paste your text here.../i);
    const generateButton = screen.getByRole('button', { name: /generate/i });

    const validText = 'word '.repeat(1000).trim();
    fireEvent.change(textarea, { target: { value: validText } });
    fireEvent.click(generateButton);

    expect(generateButton).toBeDisabled();
    expect(generateButton).toHaveTextContent('Generating...');
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(generateButton).toBeEnabled();
      expect(generateButton).toHaveTextContent('Generate');
      expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    });
  });
});
