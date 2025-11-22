import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HangmanGame from './HangmanGame';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('HangmanGame Component', () => {
  describe('Player Login', () => {
    test('renders login screen when not logged in', () => {
      render(<HangmanGame />);
      expect(screen.getByText(/Enter Your Name to Play/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Player Name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('allows user to type player name', () => {
      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      fireEvent.change(input, { target: { value: 'TestPlayer' } });
      expect(input.value).toBe('TestPlayer');
    });

    test('creates new player when name not found', async () => {
      fetch
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ playerName: 'NewPlayer', wins: 0, losses: 0 })
        });

      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'NewPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/players?playerName=NewPlayer')
        );
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/players'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ playerName: 'NewPlayer' })
          })
        );
      });
    });

    test('logs in existing player', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ playerName: 'ExistingPlayer', wins: 5, losses: 3 })
      });

      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'ExistingPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/players?playerName=ExistingPlayer')
        );
      });
    });
  });

  describe('Player Stats Display', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ playerName: 'TestPlayer', wins: 10, losses: 5 })
      });
    });

    test('displays player name after login', async () => {
      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'TestPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Player: TestPlayer/i)).toBeInTheDocument();
      });
    });

    test('displays player wins and losses', async () => {
      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'TestPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Wins: 10/i)).toBeInTheDocument();
        expect(screen.getByText(/Losses: 5/i)).toBeInTheDocument();
      });
    });

    test('calculates and displays win percentage correctly', async () => {
      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'TestPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Win Rate: 66.7%/i)).toBeInTheDocument();
      });
    });

    test('displays 0% win rate for new player', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ playerName: 'NewPlayer', wins: 0, losses: 0 })
        });

      render(<HangmanGame />);
      const input = screen.getByPlaceholderText(/Player Name/i);
      const button = screen.getByRole('button', { name: /Login/i });

      fireEvent.change(input, { target: { value: 'NewPlayer' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Win Rate: 0%/i)).toBeInTheDocument();
      });
    });
  });
});
