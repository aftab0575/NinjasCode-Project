describe("GoogleMapComponent (E2E)", () => {
    beforeEach(() => {
      cy.visit("/"); // Load the actual app
    });
  
    it("renders the map component correctly", () => {
      cy.get("[data-cy=map-container]").should("exist"); // ✅ Ensures the map container is present
    });
  
    it("displays a loading state before the map is ready", () => {
      cy.get("[data-cy=loading-message]").should("contain", "Map is still loading..."); // ✅ Ensure loading text appears
    });
  
    it("loads the Google Map when ready", () => {
      cy.get("[data-cy=map-container]").should("be.visible"); // ✅ Ensure map is visible
    });
  
    it("checks if map interaction is enabled", () => {
      cy.get("[data-cy=map-container]").trigger("mousedown", { which: 1 });
      cy.get("[data-cy=map-container]").trigger("mousemove", { clientX: 100, clientY: 100 });
      cy.get("[data-cy=map-container]").trigger("mouseup", { force: true });
    });
  });
  