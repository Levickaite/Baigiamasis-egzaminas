import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock all pages so tests do NOT rely on full implementations
jest.mock("./pages/Home", () => () => <div>Home Page</div>);
jest.mock("./pages/Automobiliai", () => () => <div>Skelbimai Page</div>);
jest.mock("./pages/Skelbimas", () => () => <div>Skelbimas Page</div>);
jest.mock("./pages/Automobilis", () => () => <div>Automobilis Page</div>);
jest.mock("./pages/ManoUzsakymai", () => () => <div>Uzsakymai Page</div>);
jest.mock("./pages/Krepselis", () => () => <div>Krepselis Page</div>);
jest.mock("./pages/Kontaktai", () => () => <div>Kontaktai Page</div>);
jest.mock("./pages/Login", () => () => <div>Login Page</div>);
jest.mock("./pages/Signup", () => () => <div>Signup Page</div>);
jest.mock("./components/Navbar", () => () => <div>Navbar</div>);
jest.mock("./components/Footer", () => () => <div>Footer</div>);

describe("App routing", () => {
  test("renders Home by default", () => {
    render(<App />);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  test("renders Skelbimai + Skelbimas on /automobiliai", () => {
    window.history.pushState({}, "", "/automobiliai");
    render(<App />);
    expect(screen.getByText("Skelbimai Page")).toBeInTheDocument();
    expect(screen.getByText("Skelbimas Page")).toBeInTheDocument();
  });

  test("renders Login page on /Prisijungti", () => {
    window.history.pushState({}, "", "/Prisijungti");
    render(<App />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
