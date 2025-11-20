import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Helper funkcija: suranda įvesties lauką po label
function getInputAfterLabel(text) {
  const label = screen.getByText(new RegExp(text, 'i'));
  return label ? label.nextElementSibling : null;
}

// Mock useLogin hook prieš importuojant komponentą
const mockLogin = jest.fn();
jest.mock('../hooks/useLogin', () => ({
  useLogin: () => ({ login: mockLogin, isLoading: false, error: null }),
}));

const Login = require('./Login').default;

describe('Login page', () => {
  test('renders inputs and button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Prisijungimas/i)).toBeInTheDocument();
    expect(getInputAfterLabel('El. paštas')).toBeInTheDocument();
    expect(getInputAfterLabel('Slaptažodis')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prisijungti/i })).toBeInTheDocument();
  });

  test('calls login with correct data', async () => {
    mockLogin.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(getInputAfterLabel('El. paštas'), { target: { value: 'user@example.com' } });
    fireEvent.change(getInputAfterLabel('Slaptažodis'), { target: { value: 'secret' } });

    fireEvent.click(screen.getByRole('button', { name: /Prisijungti/i }));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'secret')
    );
  });

  test('disables button while loading', () => {
    // Mock hook su isLoading: true
    jest.doMock('../hooks/useLogin', () => ({
      useLogin: () => ({ login: jest.fn(), isLoading: true, error: null }),
    }));

    const LoginLoading = require('./Login').default;

    render(
      <MemoryRouter>
        <LoginLoading />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Prisijungti/i })).toBeDisabled();
  });
});
