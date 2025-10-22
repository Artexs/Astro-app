import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MyCardsView from '~/components/views/my-cards/MyCardsView';
import { useMyCards } from '~/components/hooks/useMyCards';

// Mock child components
vi.mock('~/components/views/my-cards/ManagedCard', () => ({
  default: vi.fn(({ card, onDeleteRequest, showDeleteButton }) => (
    <div data-testid="managed-card" data-card-id={card.id}>
      <span>{card.question}</span>
      {showDeleteButton && (
        <button onClick={() => onDeleteRequest(card.id, card.question)}>X</button>
      )}
    </div>
  )),
}));

vi.mock('~/components/views/my-cards/InfiniteScrollLoader', () => ({
  default: vi.fn(({ onVisible }) => (
    <div data-testid="infinite-scroll-loader" onClick={onVisible}>Load More</div>
  )),
}));

vi.mock('~/components/views/my-cards/ConfirmationModal', () => ({
  default: vi.fn(({ isOpen, title, description, isProcessing, onConfirm, onCancel }) => (
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onCancel} disabled={isProcessing}>Cancel</button>
        <button onClick={onConfirm} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Confirm'}</button>
      </div>
    ) : null
  )),
}));

// Mock the useMyCards hook
vi.mock('~/components/hooks/useMyCards', () => ({
  useMyCards: vi.fn(),
}));

// Mock window.location.href
const mockLocationHref = vi.fn();
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
    get href() { return 'http://localhost:3000/'; }, // Initial value
    set href(value) { mockLocationHref(value); },
  },
});

const mockCards = [
  { id: '1', question: 'Q1', answer: 'A1' },
  { id: '2', question: 'Q2', answer: 'A2' },
];

const mockUseMyCards = (
  cards = [],
  isLoading = false,
  error = null,
  hasMore = false,
  cardToDelete = null,
  isDeleting = false,
  fetchNextPage = vi.fn(),
  requestDelete = vi.fn(),
  confirmDelete = vi.fn(),
  cancelDelete = vi.fn()
) => {
  (useMyCards as vi.Mock).mockReturnValue({
    state: {
      cards,
      isLoading,
      error,
      hasMore,
      cardToDelete,
      isDeleting,
    },
    fetchNextPage,
    requestDelete,
    confirmDelete,
    cancelDelete,
  });
};

describe('MyCardsView', () => {
  beforeEach(() => {
    mockLocationHref.mockClear(); // Reset the mock function for href
    vi.clearAllMocks();
  });

  it('should show loading spinner when initially loading', () => {
    mockUseMyCards([], true, null, false);
    render(<MyCardsView />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to /create if no cards and not loading', () => {
    mockUseMyCards([], false, null, false);
    render(<MyCardsView />);
    expect(mockLocationHref).toHaveBeenCalledWith('/create');
  });

  it('should display cards and infinite scroll loader when cards are present', () => {
    mockUseMyCards(mockCards, false, null, true);
    render(<MyCardsView />);

    expect(screen.getByRole('heading', { name: /my cards/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('managed-card')).toHaveLength(mockCards.length);
    expect(screen.getByTestId('infinite-scroll-loader')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete cards/i })).toBeInTheDocument();
  });

  it('should toggle delete mode', () => {
    mockUseMyCards(mockCards, false, null, false);
    render(<MyCardsView />);

    const deleteButton = screen.getByRole('button', { name: /delete cards/i });
    fireEvent.click(deleteButton);
    expect(deleteButton).toHaveTextContent('Exit Delete Mode');

    fireEvent.click(deleteButton);
    expect(deleteButton).toHaveTextContent('Delete Cards');
  });

  it('should call fetchNextPage when InfiniteScrollLoader is visible', () => {
    const fetchNextPageMock = vi.fn();
    mockUseMyCards(mockCards, false, null, true, null, false, fetchNextPageMock);
    render(<MyCardsView />);

    fireEvent.click(screen.getByTestId('infinite-scroll-loader')); // Simulate onVisible
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });

  it('should open confirmation modal on delete request', () => {
    const requestDeleteMock = vi.fn();
    mockUseMyCards(mockCards, false, null, false, null, false, vi.fn(), requestDeleteMock);
    render(<MyCardsView />);

    fireEvent.click(screen.getByRole('button', { name: /delete cards/i })); // Enter delete mode
    fireEvent.click(screen.getAllByRole('button', { name: 'X' })[0]); // Click delete on first card

    expect(requestDeleteMock).toHaveBeenCalledWith(mockCards[0].id, mockCards[0].question);
    // The modal is rendered based on state.cardToDelete, which is managed by useMyCards
    // We can't directly assert modal visibility here without mocking state.cardToDelete
  });

  it('should confirm and cancel delete from modal', async () => {
    const confirmDeleteMock = vi.fn();
    const cancelDeleteMock = vi.fn();
    mockUseMyCards(
      mockCards,
      false,
      null,
      false,
      { id: mockCards[0].id, question: mockCards[0].question, answer: mockCards[0].answer }, // Simulate cardToDelete being set
      false,
      vi.fn(),
      vi.fn(),
      confirmDeleteMock,
      cancelDeleteMock
    );
    const { rerender } = render(<MyCardsView />);

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(cancelDeleteMock).toHaveBeenCalledTimes(1);

    // Re-render with updated state to simulate modal closing
    mockUseMyCards(mockCards, false, null, false, null, false, vi.fn(), vi.fn(), confirmDeleteMock, cancelDeleteMock);
    rerender(<MyCardsView />);
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();

    // Simulate opening modal again and confirming
    mockUseMyCards(
      mockCards,
      false,
      null,
      false,
      { id: mockCards[0].id, question: mockCards[0].question, answer: mockCards[0].answer },
      false,
      vi.fn(),
      vi.fn(),
      confirmDeleteMock,
      cancelDeleteMock
    );
    rerender(<MyCardsView />);
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(confirmDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('should display an error message if loading cards fails', () => {
    const errorMessage = 'Failed to load cards';
    mockUseMyCards([], false, errorMessage, false);
    render(<MyCardsView />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
});
