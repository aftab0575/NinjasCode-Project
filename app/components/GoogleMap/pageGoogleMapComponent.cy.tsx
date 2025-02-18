import React from "react";
import GoogleMapComponent from "./page";
import { mount } from "cypress/react";
import { MapProvider } from "@/app/context/index"; // ✅ Import provider

describe("GoogleMapComponent", () => {
  beforeEach(() => {
    mount(
      <MapProvider> {/* ✅ Wrap with provider to avoid context issues */}
        <GoogleMapComponent />
      </MapProvider>
    );
  });

  it("renders correctly", () => {
    cy.get("div").should("exist"); // ✅ Component exists
  });

  it("contains the map container", () => {
    cy.get("[data-cy=map-container]").should("exist"); // ✅ More reliable selector
  });

  it("shows loading state when the map is not ready", () => {
    cy.get("[data-cy=loading-message]").should("contain", "Map is still loading..."); // ✅ Check UI instead of console.log
  });
});
