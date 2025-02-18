/// <reference types="cypress" />

describe("NearbyRestaurants (E2E)", () => {
    beforeEach(() => {
      // ✅ Visit the actual page where the component is rendered
      cy.visit("/restaurants"); // Update with the correct URL
  
      // ✅ Stub the user's location
      cy.window().then((win) => {
        cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((success) => {
          success({ coords: { latitude: 37.7749, longitude: -122.4194 } });
        });
      });
    });
  
    it("renders the component and button", () => {
      cy.get("button").contains("Find Restaurants 🍽️").should("be.visible");
    });
  
    it("enables the button when lat/lon are available", () => {
      cy.get("button").contains("Find Restaurants 🍽️").should("not.be.disabled");
    });
  
    it("shows loading spinner while fetching restaurants", () => {
      cy.intercept("GET", "**/maps/api/place/nearbysearch/json**", (req) => {
        req.reply((res) => {
          res.delay = 1000; // Simulate network delay
          res.send({ fixture: "mockRestaurants.json" });
        });
      }).as("fetchRestaurants");
  
      cy.get("button").contains("Find Restaurants 🍽️").click();
      cy.get(".pi-spinner").should("be.visible"); // ✅ Check for spinner
      cy.wait("@fetchRestaurants");
      cy.get(".pi-spinner").should("not.exist"); // ✅ Spinner should disappear
  
      // ✅ Ensure restaurant cards are displayed
      cy.get(".p-card").should("have.length.at.least", 1);
    });
  
    it("shows an error message when the API request fails", () => {
      cy.intercept("GET", "**/maps/api/place/nearbysearch/json**", {
        statusCode: 500,
        body: { status: "ERROR" },
      }).as("fetchError");
  
      cy.get("button").click();
      cy.wait("@fetchError");
  
      // ✅ Check for error message in UI
      cy.get("[data-cy=error-message]").should("be.visible").and("contain", "Failed to load restaurants");
  
      // ✅ Check for console error
      cy.window().then((win) => {
        cy.spy(win.console, "error").as("consoleError");
      });
      cy.get("@consoleError").should("be.calledWith", "Error fetching places:", "ERROR");
    });
  });
  