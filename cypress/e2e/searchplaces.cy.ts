/// <reference types="cypress" />

describe("SearchPlaces (E2E)", () => {
    beforeEach(() => {
      // ✅ Visit the actual page where the component is rendered
      cy.visit("/"); // Update with the correct path where SearchPlaces is used
  
      // ✅ Ensure the page loads before interacting
      cy.get("[data-cy=search-input]").should("be.visible");
    });
  
    it("renders the search input field", () => {
      cy.get("[data-cy=search-input]")
        .should("be.visible")
        .and("have.attr", "placeholder", "Search for places...");
    });
  
    it("accepts user input", () => {
      cy.get("[data-cy=search-input]").type("Pizza");
      cy.get("[data-cy=search-input]").should("have.value", "Pizza");
    });
  
    it("shows loading spinner when fetching data", () => {
      cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
        delay: 1000,
        fixture: "mockPlaces.json",
      }).as("fetchPlaces");
  
      cy.get("[data-cy=search-input]").type("Pizza");
  
      // ✅ Check if spinner appears during fetch
      cy.get("[data-cy=loading-spinner]").should("be.visible");
  
      cy.wait("@fetchPlaces");
  
      // ✅ Ensure spinner disappears after data loads
      cy.get("[data-cy=loading-spinner]").should("not.exist");
    });
  
    it("displays search results in dropdown", () => {
      cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
        fixture: "mockPlaces.json",
      }).as("fetchPlaces");
  
      cy.get("[data-cy=search-input]").type("Pizza");
      cy.wait("@fetchPlaces");
  
      // ✅ Check dropdown visibility and content
      cy.get("[data-cy=search-dropdown]").should("be.visible");
      cy.get("[data-cy=search-result]").should("have.length.at.least", 1);
    });
  
    it("selects a place and closes dropdown", () => {
      cy.intercept("GET", "**/maps/api/place/textsearch/json**", {
        fixture: "mockPlaces.json",
      }).as("fetchPlaces");
  
      cy.get("[data-cy=search-input]").type("Pizza");
      cy.wait("@fetchPlaces");
  
      cy.get("[data-cy=search-result]").first().click();
  
      // ✅ Ensure dropdown closes and input field updates
      cy.get("[data-cy=search-dropdown]").should("not.exist");
      cy.get("[data-cy=search-input]").should("not.have.value", "");
    });
  });
  