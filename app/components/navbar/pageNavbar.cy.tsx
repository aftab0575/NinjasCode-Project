import React from "react";
import { mount } from "cypress/react";
import Navbar from "./page";
import { PrimeReactProvider } from "primereact/api";
import Link from "next/link";

describe("Navbar Component", () => {
  beforeEach(() => {
    mount(
      <PrimeReactProvider> {/* ✅ Wrap with PrimeReact Provider */}
        <Navbar />
      </PrimeReactProvider>
    );
  });

  it("renders correctly", () => {
    cy.get("nav").should("exist"); // ✅ Navbar should be in the DOM
  });

  it("displays the logo correctly", () => {
    cy.get("img").should("have.attr", "alt", "Enatega Logo"); // ✅ Logo should exist with correct alt text
  });

  it("displays the brand name", () => {
    cy.contains("ENATEGA").should("exist"); // ✅ Brand name should be visible
  });

  it("has a working login link", () => {
    cy.get("a[href='/login']").should("exist").click(); // ✅ Checks if login link exists
  });
  
  
});
