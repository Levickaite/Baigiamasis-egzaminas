import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Skelbimas from "./Skelbimas";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


// Mock axios
jest.mock("axios");

// Helper funkcija renderinti su AuthContext
const renderWithAuth = (user) => {
  return render(
    <AuthContext.Provider value={{ user }}>
      <Skelbimas />
    </AuthContext.Provider>
  );
};

describe("Skelbimas komponentas", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    // Išvalome visus mock'us prieš kiekvieną testą
    jest.clearAllMocks();
    // Mock'iname localStorage
    Storage.prototype.getItem = jest.fn(() => "fake-token");
  });

  test("nerodo formos, jei user nėra adminas", () => {
    renderWithAuth({ name: "Test User", role: "user" });
    expect(screen.getByText(/Neturite teisės kurti skelbimo/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Sukurti skelbimą/i })).not.toBeInTheDocument();
  });

  test("nerodo formos, jei user yra null", () => {
    renderWithAuth(null);
    expect(screen.getByText(/Neturite teisės kurti skelbimo/i)).toBeInTheDocument();
  });

  test("rodo formą, jei user yra admin", () => {
    renderWithAuth({ name: "Admin User", role: "admin" });
    expect(screen.getByText(/Sukurti naują skelbimą/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sukurti skelbimą/i })).toBeInTheDocument();
  });

  test("formos laukai egzistuoja", () => {
    renderWithAuth({ name: "Test User", role: "admin" });
    
    // Tikrinami input laukai pagal placeholder
    expect(screen.getByPlaceholderText(/Modelis/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Kaina/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Variklis/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Galia \(AG\)/i)).toBeInTheDocument();
    
    // Tikrinami select laukai
    expect(screen.getByDisplayValue(/Pasirinkite spalvą/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Pasirinkite metus/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Pasirinkite pavarų dėžę/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Pasirinkite kuro tipą/i)).toBeInTheDocument();
    
    // Tikrinamas file input
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    
    // Tikrinamas submit mygtukas
    expect(screen.getByRole("button", { name: /Sukurti skelbimą/i })).toBeInTheDocument();
  });

  test("input laukų reikšmės keičiasi", () => {
    renderWithAuth({ name: "Test User", role: "admin" });
    
    const modelInput = screen.getByPlaceholderText(/Modelis/i);
    const priceInput = screen.getByPlaceholderText(/Kaina/i);
    const engineInput = screen.getByPlaceholderText(/Variklis/i);
    
    fireEvent.change(modelInput, { target: { value: "BMW X5" } });
    fireEvent.change(priceInput, { target: { value: "50000" } });
    fireEvent.change(engineInput, { target: { value: "3.0 Diesel" } });
    
    expect(modelInput.value).toBe("BMW X5");
    expect(priceInput.value).toBe("50000");
    expect(engineInput.value).toBe("3.0 Diesel");
  });

  test("select laukų reikšmės keičiasi", () => {
    renderWithAuth({ name: "Test User", role: "admin" });
    
    const colorSelect = screen.getByDisplayValue(/Pasirinkite spalvą/i);
    const yearSelect = screen.getByDisplayValue(/Pasirinkite metus/i);
    const gearBoxSelect = screen.getByDisplayValue(/Pasirinkite pavarų dėžę/i);
    const fuelSelect = screen.getByDisplayValue(/Pasirinkite kuro tipą/i);
    
    fireEvent.change(colorSelect, { target: { value: "Juoda" } });
    fireEvent.change(yearSelect, { target: { value: "2023" } });
    fireEvent.change(gearBoxSelect, { target: { value: "Automatinė" } });
    fireEvent.change(fuelSelect, { target: { value: "Dyzelinas" } });
    
    expect(colorSelect.value).toBe("Juoda");
    expect(yearSelect.value).toBe("2023");
    expect(gearBoxSelect.value).toBe("Automatinė");
    expect(fuelSelect.value).toBe("Dyzelinas");
  });

  test("failų įkėlimas atnaujina label tekstą", () => {
    renderWithAuth({ name: "Test User", role: "admin" });
    
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText("test.png")).toBeInTheDocument();
  });

  test("kelių failų įkėlimas rodo failų skaičių", () => {
    renderWithAuth({ name: "Test User", role: "admin" });
    
    const fileInput = screen.getByTestId("file-input");
    const file1 = new File(["content1"], "test1.png", { type: "image/png" });
    const file2 = new File(["content2"], "test2.png", { type: "image/png" });
    const file3 = new File(["content3"], "test3.png", { type: "image/png" });
    
    fireEvent.change(fileInput, { target: { files: [file1, file2, file3] } });
    
    expect(screen.getByText("3 failai pasirinkti")).toBeInTheDocument();
  });

  test("sėkmingas formos pateikimas", async () => {
    axios.post.mockResolvedValue({ data: { id: 1, model: "BMW X5" } });
    
    renderWithAuth({ name: "Test User", role: "admin" });
    
    // Užpildome formą
    fireEvent.change(screen.getByPlaceholderText(/Modelis/i), { target: { value: "BMW X5" } });
    fireEvent.change(screen.getByPlaceholderText(/Kaina/i), { target: { value: "50000" } });
    fireEvent.change(screen.getByPlaceholderText(/Variklis/i), { target: { value: "3.0 Diesel" } });
    fireEvent.change(screen.getByPlaceholderText(/Galia \(AG\)/i), { target: { value: "286" } });
    
    const colorSelect = screen.getByDisplayValue(/Pasirinkite spalvą/i);
    const yearSelect = screen.getByDisplayValue(/Pasirinkite metus/i);
    const gearBoxSelect = screen.getByDisplayValue(/Pasirinkite pavarų dėžę/i);
    const fuelSelect = screen.getByDisplayValue(/Pasirinkite kuro tipą/i);
    
    fireEvent.change(colorSelect, { target: { value: "Juoda" } });
    fireEvent.change(yearSelect, { target: { value: "2023" } });
    fireEvent.change(gearBoxSelect, { target: { value: "Automatinė" } });
    fireEvent.change(fuelSelect, { target: { value: "Dyzelinas" } });
    
    // Pateikiame formą
    const submitBtn = screen.getByRole("button", { name: /Sukurti skelbimą/i });
    fireEvent.click(submitBtn);
    
    // Tikrinamas loading būsena
    expect(submitBtn).toHaveTextContent(/Kuriama/i);
    
    // Laukiame, kol API užklausa bus baigta
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    // Tikrinamas alert
    expect(global.alert).toHaveBeenCalledWith("Naujas skelbimas sėkmingai sukurtas!");
    
    // Tikrinamas, kad forma išvalyta
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Modelis/i).value).toBe("");
      expect(screen.getByPlaceholderText(/Kaina/i).value).toBe("");
    });
  });

  test("klaidos atvejis pateikiant formą", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));
    
    renderWithAuth({ name: "Test User", role: "admin" });
    
    // Užpildome minimalią formą
    fireEvent.change(screen.getByPlaceholderText(/Modelis/i), { target: { value: "BMW X5" } });
    fireEvent.change(screen.getByPlaceholderText(/Kaina/i), { target: { value: "50000" } });
    fireEvent.change(screen.getByPlaceholderText(/Variklis/i), { target: { value: "3.0 Diesel" } });
    fireEvent.change(screen.getByPlaceholderText(/Galia \(AG\)/i), { target: { value: "286" } });
    
    const colorSelect = screen.getByDisplayValue(/Pasirinkite spalvą/i);
    const yearSelect = screen.getByDisplayValue(/Pasirinkite metus/i);
    const gearBoxSelect = screen.getByDisplayValue(/Pasirinkite pavarų dėžę/i);
    const fuelSelect = screen.getByDisplayValue(/Pasirinkite kuro tipą/i);
    
    fireEvent.change(colorSelect, { target: { value: "Juoda" } });
    fireEvent.change(yearSelect, { target: { value: "2023" } });
    fireEvent.change(gearBoxSelect, { target: { value: "Automatinė" } });
    fireEvent.change(fuelSelect, { target: { value: "Dyzelinas" } });
    
    // Pateikiame formą
    const submitBtn = screen.getByRole("button", { name: /Sukurti skelbimą/i });
    fireEvent.click(submitBtn);
    
    // Laukiame, kol API užklausa bus baigta
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    
    // Tikrinamas klaidos alert
    expect(global.alert).toHaveBeenCalledWith("Nepavyko sukurti skelbimo.");
    
    // Tikrinamas, kad mygtukas vėl rodo normalų tekstą
    await waitFor(() => {
      expect(submitBtn).toHaveTextContent(/Sukurti skelbimą/i);
    });
  });

  test("axios.post kviečiamas su teisingais parametrais", async () => {
    axios.post.mockResolvedValue({ data: { id: 1 } });
    
    renderWithAuth({ name: "Test User", role: "admin" });
    
    // Užpildome formą
    fireEvent.change(screen.getByPlaceholderText(/Modelis/i), { target: { value: "BMW X5" } });
    fireEvent.change(screen.getByPlaceholderText(/Kaina/i), { target: { value: "50000" } });
    fireEvent.change(screen.getByPlaceholderText(/Variklis/i), { target: { value: "3.0" } });
    fireEvent.change(screen.getByPlaceholderText(/Galia \(AG\)/i), { target: { value: "286" } });
    
    const colorSelect = screen.getByDisplayValue(/Pasirinkite spalvą/i);
    const yearSelect = screen.getByDisplayValue(/Pasirinkite metus/i);
    const gearBoxSelect = screen.getByDisplayValue(/Pasirinkite pavarų dėžę/i);
    const fuelSelect = screen.getByDisplayValue(/Pasirinkite kuro tipą/i);
    
    fireEvent.change(colorSelect, { target: { value: "Juoda" } });
    fireEvent.change(yearSelect, { target: { value: "2023" } });
    fireEvent.change(gearBoxSelect, { target: { value: "Automatinė" } });
    fireEvent.change(fuelSelect, { target: { value: "Dyzelinas" } });
    
    // Pateikiame formą
    fireEvent.click(screen.getByRole("button", { name: /Sukurti skelbimą/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/Autonamai/automobiliai`,
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer fake-token",
          }),
        })
      );
    });
  });
});