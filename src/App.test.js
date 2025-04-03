import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

test('renders welcome message on home page', () => {
  render(<App />);
  const heading = screen.getByText(/job listings/i); 
  expect(heading).toBeInTheDocument();
});

test('renders login page heading', () => {
  render(<App />);
  window.history.pushState({}, 'Login Page', '/login');
  const loginHeading = screen.queryByText(/login/i);
  expect(loginHeading).toBeInTheDocument();
});
