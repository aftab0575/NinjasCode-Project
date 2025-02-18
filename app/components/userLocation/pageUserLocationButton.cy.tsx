import React from "react";
import UserLocationButton from "./page";
import { mount } from "cypress/react";
import { MapProvider } from "@/app/context/index"; // ✅ Wrap with MapProvider

describe("UserLocationButton Component", () => {
  
  it("renders correctly", () => {
    mount(
      <MapProvider>
        <UserLocationButton />
      </MapProvider>
    );

    cy.get("button").should("contain", "My Location");
    cy.get("input").should("have.attr", "placeholder", "Your location will appear here");
  });

  it("handles geolocation success", () => {
    mount(
      <MapProvider>
        <UserLocationButton />
      </MapProvider>
    );

    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } });
    });

    cy.intercept("GET", "**/maps/api/geocode/**", {
      statusCode: 200,
      body: { results: [{ formatted_address: "New York, USA" }], status: "OK" },
    }).as("getLocation");

    cy.contains("My Location").click();
    cy.wait("@getLocation");

    cy.get("input").should("have.value", "New York, USA");
  });

  it("shows loading state when fetching", () => {
    mount(
      <MapProvider>
        <UserLocationButton />
      </MapProvider>
    );

    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } });
    });

    cy.contains("My Location").click();
    cy.get("button").should("contain", "Fetching...").and("be.disabled");
  });

  it("handles geolocation error", () => {
    mount(
      <MapProvider>
        <UserLocationButton />
      </MapProvider>
    );

    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((_, error) => {
      error({ message: "User denied location access" });
    });

    cy.contains("My Location").click();
    cy.get("input").should("have.value", "Error getting location");
  });

  it("displays error when API fails", () => {
    mount(
      <MapProvider>
        <UserLocationButton />
      </MapProvider>
    );

    cy.stub(navigator.geolocation, "getCurrentPosition").callsFake((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.006 } });
    });

    cy.intercept("GET", "**/maps/api/geocode/**", { statusCode: 500 }).as("getLocationFail");

    cy.contains("My Location").click();
    cy.wait("@getLocationFail");

    cy.get("input").should("have.value", "Error fetching location");
  });
});

