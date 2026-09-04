import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

jest.mock("../components/header", () => {
  return function MockHeader() {
    return <div data-testid="header"> Header </div>
  }
});

jest.mock("../components/Cards", () => {
  return function MockCards() {
    return <div data-testid="cards"> Cards </div>;
  }
});

jest.mock("../components/banner", () => {
  return function MockBanner() {
    return <div data-testid="banner"> Banner </div>
  }
});

describe("Home Page", () => {
  
  test("should render the home page correctly", () => {

    render(<Home />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("cards")).toBeInTheDocument();
    expect(screen.getByTestId("banner")).toBeInTheDocument();
  
  });

   test("should display all main sections of the home page", () => {
    
    render(<Home />);

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Banner")).toBeInTheDocument();
  
 })

});