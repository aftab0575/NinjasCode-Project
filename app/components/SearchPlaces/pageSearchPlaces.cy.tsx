import { mount } from "cypress/react";
import SearchPlaces from "./page";
import { MapProvider } from "@/app/context/index";

describe("SearchPlaces Component", () => {
  beforeEach(() => {
    cy.log("Mounting SearchPlaces...");
    mount(
      <MapProvider>
        <SearchPlaces />
      </MapProvider>
    );
    cy.wait(500); // Ensure the component is mounted
    cy.log("Component Mounted");
  });

  it("renders the search input field", () => {
    cy.get("input").should("be.visible").and("have.attr", "placeholder", "Search for places...");
  });

  it("accepts user input", () => {
    cy.get("input").type("Pizza");
    cy.get("input").should("have.value", "Pizza");
  });

  it("shows loading spinner when fetching data", () => {
    cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
      delay: 1000, 
      fixture: "mockPlaces.json",
    }).as("fetchPlaces");

    cy.get("input").type("Pizza");
    cy.get(".pi-spinner").should("be.visible");
    
    cy.wait("@fetchPlaces");
    cy.get(".pi-spinner").should("not.exist");
  });

  it("displays search results in dropdown", () => {
    cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
      fixture: "mockPlaces.json",
    }).as("fetchPlaces");

    cy.get("input").type("Pizza");
    cy.wait("@fetchPlaces");

    cy.get("ul").should("be.visible");
    cy.get("li").should("have.length.at.least", 1);
  });

  it("selects a place and closes dropdown", () => {
    cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
      fixture: "mockPlaces.json",
    }).as("fetchPlaces");

    cy.get("input").type("Pizza");
    cy.wait("@fetchPlaces");

    cy.get("li").first().click();
    cy.get("ul").should("not.exist");
    cy.get("input").should("not.have.value", "");
  });
});
