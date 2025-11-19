import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Automobilis from "./Automobilis";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// Mock axios
jest.mock("axios");

// Mock window.confirm
const confirmSpy = jest.spyOn(window, "confirm");

// Mock window.location
delete window.location;
window.location = { href: "" };

function renderWithAuth(ui, { user } = {}) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={["/automobiliai/1"]}>
        <Routes>
          <Route path="/automobiliai/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

const mockCar = {
  _id: "1",
  model: "Audi",
  price: 15000,
  color: "Juoda",
  fuelType: "Dyzelinas",
  gearBox: "Automatinė",
  engine: "2.0",
  power: "120",
  year: "2016",
  photo: "img.jpg",
  rezervuotas: false,
  parduotas: false,
};

beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockCar });
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );
  confirmSpy.mockReturnValue(true);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Automobilis page tests", () => {
  test("shows loading state", () => {
    renderWithAuth(<Automobilis />);
    expect(screen.getByText(/Kraunama/i)).toBeInTheDocument();
  });

  test("fetches and renders car data", async () => {
    renderWithAuth(<Automobilis />);

    expect(await screen.findByText("Automobilio informacija")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Audi" })).toBeInTheDocument();
    expect(screen.getByText("15000")).toBeInTheDocument();
  });

  test("shows admin buttons when user is admin", async () => {
    renderWithAuth(<Automobilis />, {
      user: { role: "admin", token: "abc" },
    });

    await screen.findByText("Automobilio informacija");

    expect(screen.getByText("Redaguoti")).toBeInTheDocument();
    expect(screen.getByText("Ištrinti")).toBeInTheDocument();
  });

  test("does NOT show admin buttons for normal user", async () => {
    renderWithAuth(<Automobilis />, { user: { role: "user" } });

    await screen.findByText("Automobilio informacija");

    expect(screen.queryByText("Redaguoti")).not.toBeInTheDocument();
    expect(screen.queryByText("Ištrinti")).not.toBeInTheDocument();
  });

  test("enters edit mode when admin clicks 'Redaguoti'", async () => {
    renderWithAuth(<Automobilis />, { user: { role: "admin" } });

    await screen.findByText("Automobilio informacija");

    fireEvent.click(screen.getByText("Redaguoti"));

    expect(screen.getByLabelText(/Modelis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kaina/i)).toHaveValue("15000");
  });

  test("saves edited car", async () => {
    axios.patch = jest.fn().mockResolvedValue({
      data: { ...mockCar, model: "Audi A6" },
    });

    renderWithAuth(<Automobilis />, { user: { role: "admin" } });

    await screen.findByText("Automobilio informacija");

    fireEvent.click(screen.getByText("Redaguoti"));
    fireEvent.change(screen.getByLabelText(/Modelis/i), {
      target: { value: "Audi A6" },
    });

    fireEvent.click(screen.getByText("Išsaugoti"));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Audi A6" })).toBeInTheDocument()
    );
  });

  test("deletes car after confirmation", async () => {
    axios.delete = jest.fn().mockResolvedValue({ status: 200 });

    renderWithAuth(<Automobilis />, { user: { role: "admin" } });

    await screen.findByText("Automobilio informacija");

    fireEvent.click(screen.getByText("Ištrinti"));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(window.location.href).toBe("/automobiliai");
  });

  test("prevents non-logged users from adding to cart", async () => {
    renderWithAuth(<Automobilis />, { user: null });

    await screen.findByText("Automobilio informacija");

    // No button should be rendered
    expect(screen.queryByText(/Įdėti į krepšelį/i)).not.toBeInTheDocument();
  });

  test("does not allow add-to-cart when car is sold", async () => {
    axios.get.mockResolvedValue({
      data: { ...mockCar, parduotas: true },
    });

    renderWithAuth(<Automobilis />, {
      user: { token: "abc" },
    });

    await screen.findByText("Automobilio informacija");

    const btn = screen.getByText("PARDUOTA");
    expect(btn).toBeDisabled();
  });

  test("opens lightbox when image clicked", async () => {
    renderWithAuth(<Automobilis />);

    await screen.findByText("Automobilio informacija");

    fireEvent.click(screen.getByAltText("Audi"));

    expect(screen.getByRole("button", { name: "×" })).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("closes lightbox when X clicked", async () => {
    renderWithAuth(<Automobilis />);

    await screen.findByText("Automobilio informacija");

    fireEvent.click(screen.getByAltText("Audi"));

    fireEvent.click(screen.getByRole("button", { name: "×" }));

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "×" })).not.toBeInTheDocument()
    );
  });
});
