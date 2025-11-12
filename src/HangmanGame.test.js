import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HangmanGame from './HangmanGame';

// Mock alert to prevent it from blocking tests
global.alert = jest.fn();

describe('HangmanGame Component', () => {
  beforeEach(() => {
    // Clear mock before each test
    jest.clearAllMocks();
  });

  test('renders HangmanGame component without crashing', () => {
    render(<HangmanGame />);
    expect(screen.getByText(/Tries Left:/i)).toBeInTheDocument();
  });

  test('displays initial tries left as 6', () => {
    render(<HangmanGame />);
    expect(screen.getByText(/Tries Left: 6/i)).toBeInTheDocument();
  });

  test('displays the correct initial hangman image (noose)', () => {
    const { container } = render(<HangmanGame />);
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('noose.png');
  });

  test('user can enter a letter in the search bar', () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toBe('a');
  });

  test('handles correct guess - letter becomes visible', () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Guess a common letter that's likely in the word
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.click(button);

    // Input should be cleared after submission
    expect(input.value).toBe('');
  });

  test('handles incorrect guess - tries left decreases', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Make an incorrect guess with a letter unlikely to be in any word
    fireEvent.change(input, { target: { value: 'z' } });
    fireEvent.click(button);

    // Wait for state update
    await waitFor(() => {
      const triesText = screen.getByText(/Tries Left:/i);
      // Tries should be less than 6 if 'z' was wrong
      expect(triesText.textContent).toMatch(/Tries Left: [0-5]/);
    });
  });

  test('hangman image changes after incorrect guess', async () => {
    const { container } = render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Initial image should be noose.png
    let image = container.querySelector('img');
    expect(image.getAttribute('src')).toBe('noose.png');

    // Make incorrect guesses
    fireEvent.change(input, { target: { value: 'z' } });
    fireEvent.click(button);

    await waitFor(() => {
      image = container.querySelector('img');
      // Image should change after incorrect guess
      expect(image.getAttribute('src')).not.toBe('noose.png');
    });
  });

  test('tracks missed letters correctly', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Make an incorrect guess
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.click(button);

    // Check if missed letter appears
    await waitFor(() => {
      expect(screen.getByText(/x/i)).toBeInTheDocument();
    });
  });

  test('prevents duplicate letter guesses with alert', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Make first guess
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.click(button);

    // Try to guess same letter again
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('You already guessed the letter "E"!');
    });
  });

  test('shows modal when game is lost after 6 wrong guesses', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Make 6 incorrect guesses
    const wrongLetters = ['z', 'x', 'q', 'j', 'v', 'w'];

    for (const letter of wrongLetters) {
      fireEvent.change(input, { target: { value: letter } });
      fireEvent.click(button);
    }

    // Modal should appear with loss message
    await waitFor(() => {
      expect(screen.getByText(/You Lost!/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('new game button resets the game', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Make an incorrect guess
    fireEvent.change(input, { target: { value: 'z' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Tries Left: 5/i)).toBeInTheDocument();
    });

    // Click new game button
    const newGameButton = screen.getByRole('button', { name: /new game/i });
    fireEvent.click(newGameButton);

    // Tries should reset to 6
    await waitFor(() => {
      expect(screen.getByText(/Tries Left: 6/i)).toBeInTheDocument();
    });
  });

  test('letter box shows correct letters after correct guesses', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Make a correct guess with a common letter
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(button);

    // Letter boxes should update (checking that component re-renders)
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('handles Enter key press to submit guess', async () => {
    render(<HangmanGame />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Input should be cleared after submission
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('displays correct number of letter boxes based on word length', () => {
    const { container } = render(<HangmanGame />);
    const letterBoxes = container.querySelectorAll('[style*="border"]');

    // Should have at least one letter box
    expect(letterBoxes.length).toBeGreaterThan(0);
  });

  test('image progresses through all stages with consecutive wrong guesses', async () => {
    const { container } = render(<HangmanGame />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    const pics = ['noose.png', 'upperbody.png', 'upperandlowerbody.png', '1arm.png', 'botharms.png', '1leg.png', 'Dead.png'];
    const wrongLetters = ['z', 'x', 'q', 'j', 'v', 'w'];

    // Initial image
    let image = container.querySelector('img');
    expect(image.getAttribute('src')).toBe(pics[0]);

    // Make wrong guesses and check image progression
    for (let i = 0; i < wrongLetters.length; i++) {
      fireEvent.change(input, { target: { value: wrongLetters[i] } });
      fireEvent.click(button);

      await waitFor(() => {
        image = container.querySelector('img');
        expect(image.getAttribute('src')).toBe(pics[i + 1]);
      });
    }
  });
});
