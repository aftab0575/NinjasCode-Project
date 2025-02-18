import { mount } from "cypress/react";
import NearbyRestaurants from "./page"; // Path to your component
import { MapProvider } from "@/app/context"; // Ensure correct path

describe("NearbyRestaurants Component - Basic Tests", () => {
  beforeEach(() => {
    // ✅ Wrap the component in `MapProvider`
    mount(
      <MapProvider>
        <NearbyRestaurants lat={37.7749} lon={-122.4194} />
      </MapProvider>
    );
  });

  it("renders the component", () => {
    cy.get("button").contains("Find Restaurants 🍽️").should("be.visible");
  });

  it("enables the button when valid lat/lon are provided", () => {
    mount(
      <MapProvider>
        <NearbyRestaurants lat={37.7749} lon={-122.4194} />
      </MapProvider>
    );

    cy.get("button").contains("Find Restaurants 🍽️").should("not.be.disabled");
  });

  it("shows loading spinner when fetching data and hides after loading", () => {
    mount(
      <MapProvider>
        <NearbyRestaurants lat={37.7749} lon={-122.4194} />
      </MapProvider>
    );
  
    // Intercept API request and simulate a delay
    cy.intercept("GET", "**/maps/api/place/nearbysearch/json**", (req) => {
      req.reply((res) => {
        res.delay = 1000; // Simulate network delay
        res.send({ fixture: "mockRestaurants.json" });
      });
    }).as("fetchRestaurants");
  
    // Click the button to trigger data fetch
    cy.get("button").contains("Find Restaurants 🍽️").click();
  
    // Spinner should be visible while loading
    cy.get(".pi-spinner").should("be.visible");
  
    // Wait for API call and ensure spinner disappears after data is fetched
    cy.wait("@fetchRestaurants");
    cy.get(".pi-spinner").should("not.exist");
  
    // Ensure restaurants are displayed after fetching data
    cy.get(".p-card").should("have.length.at.least", 1);
  });
  

  it("shows an error message when the API request fails", () => {
    mount(
      <MapProvider>
        <NearbyRestaurants lat={37.7749} lon={-122.4194} />
      </MapProvider>
    );

    cy.intercept("GET", "**/maps/api/place/nearbysearch/json**", {
      statusCode: 500,
      body: { status: "ERROR" },
    }).as("fetchError");

    cy.get("button").click();
    cy.wait("@fetchError");

    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });

    cy.get("@consoleError").should("be.calledWith", "Error fetching places:", "ERROR");
  });
});
