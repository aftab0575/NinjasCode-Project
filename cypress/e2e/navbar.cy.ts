describe("Navbar (E2E)", () => {
    beforeEach(() => {
      cy.visit("/"); // Load the full application
    });
  
    it("renders the navbar correctly", () => {
      cy.get("nav").should("exist"); // ✅ Navbar should be in the DOM
    });
  
    it("displays the logo correctly", () => {
      cy.get("img").should("have.attr", "alt", "Enatega Logo"); // ✅ Logo should exist with correct alt text
    });
  
    it("displays the brand name", () => {
      cy.contains("ENATEGA").should("exist"); // ✅ Brand name should be visible
    });
  
    it("navigates to the login page when login link is clicked", () => {
      cy.get("a[href='/login']").should("exist").click(); // ✅ Click login link
      cy.url().should("include", "/login"); // ✅ Ensure URL changed to login page
    });
  
    it("ensures menu links are visible and functional", () => {
      cy.get("nav a").each(($el) => {
        cy.wrap($el).should("be.visible"); // ✅ Ensure all links are visible
      });
    });
  });
  