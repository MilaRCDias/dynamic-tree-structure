import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page header title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Dynamic tree/i);
  expect(linkElement).toBeInTheDocument();
});
