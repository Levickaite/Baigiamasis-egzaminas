import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

const mockSignup = jest.fn();
jest.mock('../hooks/useSignup', () => ({
  useSignup: () => ({ signup: mockSignup, isLoading: false, error: null }),
}));

const Signup = require('./Signup').default;

function getInputAfterLabel(text) {
  const label = screen.getByText(new RegExp(text, 'i'));
  return label ? label.nextElementSibling : null;
}

describe('Signup page', () => {
  test('renders inputs and submit button', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByText(/Registracija/i)).toBeInTheDocument();
    expect(getInputAfterLabel('Vardas')).toBeInTheDocument();
    expect(getInputAfterLabel('Pavardė')).toBeInTheDocument();
    expect(getInputAfterLabel('El. paštas')).toBeInTheDocument();
    expect(getInputAfterLabel('Slaptažodis')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registruotis/i })).toBeInTheDocument();
  });

  test('calls signup with correct data', async () => {
    mockSignup.mockResolvedValue(true);

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getInputAfterLabel('Vardas'), { target: { value: 'Jonas' } });
    fireEvent.change(getInputAfterLabel('Pavardė'), { target: { value: 'Jonaitis' } });
    fireEvent.change(getInputAfterLabel('El. paštas'), { target: { value: 'jonas@example.com' } });
    fireEvent.change(getInputAfterLabel('Slaptažodis'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Registruotis/i }));

    await waitFor(() =>
      expect(mockSignup).toHaveBeenCalledWith(
        'jonas@example.com',
        'password123',
        'Jonas',
        'Jonaitis'
      )
    );
  });
});
