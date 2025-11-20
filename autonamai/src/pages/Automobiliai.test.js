import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Automobiliai from "./Automobiliai";

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            model: "Audi",
            color: "Juoda",
            engine: "2.0",
            gearBox: "Automatinė",
            fuelType: "Dyzelinas",
            power: "110",
            price: 10000,
            photo: "photo1.jpg",
          },
          {
            _id: "2",
            model: "BMW",
            color: "Balta",
            engine: "3.0",
            gearBox: "Mechaninė",
            fuelType: "Benzinas",
            power: "150",
            price: 15000,
            photo: "photo2.jpg",
          },
        ]),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

// helper: get sidebar filter by label text even without htmlFor
const getSidebarSelect = (labelText) => {
  const group = screen.getByText(labelText).closest(".filter-group");
  return within(group).getByRole("combobox");
};

describe("Automobiliai page", () => {
  test("renders car cards from fetched data", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { level: 3, name: "Audi" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 3, name: "BMW" })).toBeInTheDocument();
  });

  test("filters by model", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { level: 3, name: "Audi" });

    const modelSelect = getSidebarSelect("Modelis:");
    fireEvent.change(modelSelect, { target: { value: "Audi" } });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Audi" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "BMW" })).not.toBeInTheDocument();
    });
  });

  test("search filters by model name", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { level: 3, name: "Audi" });

    fireEvent.change(screen.getByPlaceholderText(/Paieška/i), {
      target: { value: "bmw" },
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "BMW" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Audi" })).not.toBeInTheDocument();
    });
  });

  test("filters by color", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { level: 3, name: "Audi" });

    const colorSelect = getSidebarSelect("Spalva:");
    fireEvent.change(colorSelect, { target: { value: "Juoda" } });

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Audi" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "BMW" })).not.toBeInTheDocument();
    });
  });

  test("sorts by price ascending", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { level: 3, name: "Audi" });

    // Top bar sorting: second select inside .filter-top-bar
    const topBar = document.querySelector(".filter-top-bar");
    const sortSelect = within(topBar).getAllByRole("combobox")[0];

    fireEvent.change(sortSelect, { target: { value: "asc" } });

    await waitFor(() => {
      const prices = screen.getAllByText(/Kaina:/i);
      expect(prices[0]).toHaveTextContent("10000");
      expect(prices[1]).toHaveTextContent("15000");
    });
  });

  test("reset filters button resets all filters", async () => {
    render(
      <MemoryRouter>
        <Automobiliai />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { level: 3, name: "Audi" });

    const modelSelect = getSidebarSelect("Modelis:");
    fireEvent.change(modelSelect, { target: { value: "Audi" } });

    fireEvent.click(screen.getByText(/Išvalyti filtrus/i));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Audi" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "BMW" })).toBeInTheDocument();
    });
  });
});
