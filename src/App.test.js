import { render, screen } from '@testing-library/react';
import HangmanGame from './HangmanGame';

test('renders Hangman game', () => {
  render(<HangmanGame />);
  const triesElement = screen.getByText(/Tries Left:/i);
  expect(triesElement).toBeInTheDocument();
});
