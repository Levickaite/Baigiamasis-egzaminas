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

import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Uzsakymai from "./ManoUzsakymai";
import { MemoryRouter } from "react-router-dom";

// mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// mock fetch
global.fetch = jest.fn();

// mock localStorage
function mockLocalStorage(user, token = "test-token") {
  const store = {
    user: JSON.stringify(user),
    token: token,
  };
  jest
    .spyOn(window.localStorage.__proto__, "getItem")
    .mockImplementation((key) => store[key]);
}

const mockOrders = [
  {
    _id: "1",
    model: "Audi",
    price: 15000,
    photo: "audi.jpg",
    email: "test@test.com",
    status: "Laukiama",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    _id: "2",
    model: "BMW",
    price: 20000,
    photo: "bmw.jpg",
    email: "test@test.com",
    status: "Patvirtinta",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

describe("Uzsakymai page tests", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test("loads and displays user orders", async () => {
    mockLocalStorage({ email: "test@test.com", role: "user" });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    });

    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    expect(await screen.findByText("Audi")).toBeInTheDocument();
    expect(screen.getByText("BMW")).toBeInTheDocument();
  });

  test("filters by status", async () => {
  mockLocalStorage({ email: "admin@test.com", role: "admin" });

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockOrders,
  });

  render(
    <MemoryRouter>
      <Uzsakymai />
    </MemoryRouter>
  );

  await screen.findByText("Audi");

  // Find the SIDEBAR status filter (not admin one)
  const sidebar = screen.getAllByText("Statusas:")[0].closest(".filter-group");
  const statusSelect = within(sidebar).getByRole("combobox");

  // Change filter to Patvirtinta
  fireEvent.change(statusSelect, {
    target: { value: "Patvirtinta" },
  });

  expect(screen.getByText("BMW")).toBeInTheDocument();
  expect(screen.queryByText("Audi")).toBeNull();
});




  test("search filters models", async () => {
    mockLocalStorage({ email: "test@test.com", role: "user" });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    });

    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    await screen.findByText("Audi");

    fireEvent.change(screen.getByPlaceholderText("Paieška"), {
      target: { value: "Audi" },
    });

    expect(screen.getByText("Audi")).toBeInTheDocument();
    expect(screen.queryByText("BMW")).not.toBeInTheDocument();
  });

  test("admin sees status dropdown and can change status", async () => {
    mockLocalStorage({ email: "admin@test.com", role: "admin" });

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockOrders[0],
          status: "Patvirtinta",
        }),
      });

    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    const dropdown = await screen.findByDisplayValue("Laukiama");

    fireEvent.change(dropdown, {
      target: { value: "Patvirtinta" },
    });

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/uzsakymas/1"),
        expect.any(Object)
      )
    );
  });

  test("shows 'Nerasta užsakymų' when no matches", async () => {
    mockLocalStorage({ email: "test@test.com", role: "user" });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <Uzsakymai />
      </MemoryRouter>
    );

    await screen.findByText("Nerasta užsakymų.");
  });

  test("pagination works", async () => {
  mockLocalStorage({ email: "test@test.com", role: "user" });

  const manyOrders = Array.from({ length: 10 }, (_, i) => ({
    _id: String(i + 1),
    model: "Audi " + (i + 1),
    price: 10000,
    photo: "car.jpg",
    email: "test@test.com",
    status: "Laukiama",
    createdAt: "2024-01-01T00:00:00Z",
  }));

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => manyOrders,
  });

  render(
    <MemoryRouter>
      <Uzsakymai />
    </MemoryRouter>
  );

  await screen.findByText("Audi 6");

  fireEvent.click(screen.getByText("Kitas"));

  // FIXED: multiple matches handled properly
  expect(
    screen.getAllByText(/Puslapis\s*2/i).length
  ).toBeGreaterThan(0);
});
});
