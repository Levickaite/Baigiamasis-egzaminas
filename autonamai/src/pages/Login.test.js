import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Bendras mock-as, kuris bus perrašomas testuose
let mockReturn = { login: jest.fn(), isLoading: false, error: null };

// Hooko mockas
jest.mock('../hooks/useLogin', () => ({
  useLogin: () => mockReturn,
}));

// Helper funkcija
function getInputAfterLabel(text) {
  const label = screen.getByText(new RegExp(text, 'i'));
  return label ? label.nextElementSibling : null;
}

const Login = require('./Login').default;

describe('Login page', () => {
  beforeEach(() => {
    mockReturn = { login: jest.fn(), isLoading: false, error: null }; // reset
  });

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
    mockReturn.login.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(getInputAfterLabel('El. paštas'), { target: { value: 'user@example.com' } });
    fireEvent.change(getInputAfterLabel('Slaptažodis'), { target: { value: 'secret' } });

    fireEvent.click(screen.getByRole('button', { name: /Prisijungti/i }));

    await waitFor(() =>
      expect(mockReturn.login).toHaveBeenCalledWith('user@example.com', 'secret')
    );
  });

  test('disables button while loading', () => {
    // Perrašome tik tai, ką grąžina hook'as
    mockReturn = { login: jest.fn(), isLoading: true, error: null };

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Prisijungti/i })).toBeDisabled();
  });
});