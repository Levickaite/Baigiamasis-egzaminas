// src/pages/Uzsakymai.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock localStorage
const mockUser = { email: "user@example.com", role: "user" };
beforeEach(() => {
  localStorage.setItem("user", JSON.stringify(mockUser));
  localStorage.setItem("token", "mock-token");
});

// Mock fetch
const mockCars = [
  {
    _id: "1",
    model: "BMW",
    price: 20000,
    status: "Patvirtinta",
    createdAt: "2025-01-01T12:00:00Z",
    photo: null,
  },
  {
    _id: "2",
    model: "Audi",
    price: 15000,
    status: "Laukiama",
    createdAt: "2025-02-01T12:00:00Z",
    photo: null,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockCars),
  })
);

const Uzsakymai = require("./Uzsakymai").default;

describe("Uzsakymai component", () => {
  test("renders page title and search input", async () => {
    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mano Užsakymai/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paieška/i)).toBeInTheDocument();

    // Wait for fetch data to render cards
    await waitFor(() => {
      expect(screen.getByText(/BMW/i)).toBeInTheDocument();
      expect(screen.getByText(/Audi/i)).toBeInTheDocument();
    });
  });

  test("filters cars by search", async () => {
    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/BMW/i));

    const searchInput = screen.getByPlaceholderText(/Paieška/i);
    fireEvent.change(searchInput, { target: { value: "BMW" } });

    expect(screen.getByText(/BMW/i)).toBeInTheDocument();
    expect(screen.queryByText(/Audi/i)).not.toBeInTheDocument();
  });

  test("pagination buttons work", async () => {
    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/BMW/i));

    const nextButton = screen.getByText(/Kitas/i);
    const prevButton = screen.getByText(/Prieš/i);

    // Since we have only 2 cars, next should be disabled
    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  test("status filter works", async () => {
    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/BMW/i));

    const statusSelect = screen.getByLabelText(/Statusas/i);
    fireEvent.change(statusSelect, { target: { value: "Patvirtinta" } });

    expect(screen.getByText(/BMW/i)).toBeInTheDocument();
    expect(screen.queryByText(/Audi/i)).not.toBeInTheDocument();
  });
});
