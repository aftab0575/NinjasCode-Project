describe("User Location Feature (E2E)", () => {
  beforeEach(() => {
    cy.visit("/"); // Load the full application
  });

  it("renders the user location button correctly", () => {
    cy.get("button").should("contain", "My Location");
    cy.get("input").should("have.attr", "placeholder", "Your location will appear here");
  });

  it("fetches and displays the user’s location on success", () => {
    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success: (position: GeolocationPosition) => void) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } } as GeolocationPosition);
    });

    cy.intercept("GET", "**/maps/api/geocode/**", {
      statusCode: 200,
      body: { results: [{ formatted_address: "New York, USA" }], status: "OK" },
    }).as("getLocation");

    cy.contains("My Location").click();
    cy.wait("@getLocation");

    cy.get("input").should("have.value", "New York, USA");
  });

  it("shows loading state when fetching location", () => {
    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success: (position: GeolocationPosition) => void) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } } as GeolocationPosition);
    });

    cy.contains("My Location").click();
    cy.get("button").should("contain", "Fetching...").and("be.disabled");
  });

  it("handles geolocation error when denied by user", () => {
    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((_success: any, error: (err: GeolocationPositionError) => void) => {
      error({ message: "User denied location access" } as GeolocationPositionError);
    });

    cy.contains("My Location").click();
    cy.get("input").should("have.value", "Error getting location");
  });

  it("displays error message when API request fails", () => {
    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success: (position: GeolocationPosition) => void) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } } as GeolocationPosition);
    });

    cy.intercept("GET", "**/maps/api/geocode/**", { statusCode: 500 }).as("getLocationFail");

    cy.contains("My Location").click();
    cy.wait("@getLocationFail");

    cy.get("input").should("have.value", "Error fetching location");
  });
});
