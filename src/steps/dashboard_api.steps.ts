import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { config } from "../support/config";

// TC_API_USER_DASH_06 - Verify Access Plants List API
When(
  "I send a GET request to {string}",
  async function (this: CustomWorld, endpoint: string) {
    const token = this.parameters["token"]; // Use 'token' to match setup.steps.ts

    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Store response with a status() method to match Playwright Response interface
    this.parameters["response"] = {
      status: () => response.status,
    };
    this.parameters["apiResponseBody"] = await response.json();
  },
);

Then("the response should be a JSON array", async function (this: CustomWorld) {
  const responseBody = this.parameters["apiResponseBody"];
  expect(Array.isArray(responseBody)).toBeTruthy();
});

Then(
  "the response should contain plants list",
  async function (this: CustomWorld) {
    const responseBody = this.parameters["apiResponseBody"];

    // Verify it's an array
    expect(Array.isArray(responseBody)).toBeTruthy();

    // If array has items, verify first item has plant properties
    if (responseBody.length > 0) {
      const firstPlant = responseBody[0];
      expect(firstPlant).toHaveProperty("id");
      expect(firstPlant).toHaveProperty("name");
    }
    // If array is empty, that's also valid - it just means no plants exist yet
  },
);

// TC_API_USER_DASH_07 - Verify Access Categories List API
Then(
  "the response should contain categories list",
  async function (this: CustomWorld) {
    const responseBody = this.parameters["apiResponseBody"];

    // Verify it's an array
    expect(Array.isArray(responseBody)).toBeTruthy();

    // If array has items, verify first item has category properties
    if (responseBody.length > 0) {
      const firstCategory = responseBody[0];
      expect(firstCategory).toHaveProperty("id");
      expect(firstCategory).toHaveProperty("name");
    }
    // If array is empty, that's also valid - it just means no categories exist yet
  },
);

// TC_API_USER_DASH_09 - Verify API Health
When(
  "I send a GET request to {string} without authentication",
  async function (this: CustomWorld, endpoint: string) {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Store response with a status() method to match Playwright Response interface
    this.parameters["response"] = {
      status: () => response.status,
    };
    this.parameters["apiResponseBody"] = await response.json();
  },
);

Then(
  "the response should contain health status",
  async function (this: CustomWorld) {
    const responseBody = this.parameters["apiResponseBody"];

    // Verify response has status property
    expect(responseBody).toHaveProperty("status");

    // Optionally verify status value
    if (responseBody.status) {
      expect(typeof responseBody.status).toBe("string");
    }
  },
);

// TC_API_USER_DASH_10 - Verify Logout API
When(
  "I send a POST request to {string} with the token",
  async function (this: CustomWorld, endpoint: string) {
    const token = this.parameters["token"]; // Use 'token' to match setup.steps.ts

    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Store response with a status() method to match Playwright Response interface
    this.parameters["response"] = {
      status: () => response.status,
    };

    // Try to parse JSON response, but handle cases where there's no body
    try {
      this.parameters["apiResponseBody"] = await response.json();
    } catch (error) {
      // If no JSON body, that's okay for logout
      this.parameters["apiResponseBody"] = {};
    }
  },
);

Then("the token should be invalidated", async function (this: CustomWorld) {
  const token = this.parameters["token"];

  // Try to use the token to access a protected endpoint
  const testResponse = await fetch(`${config.apiBaseUrl}${config.apiPlants}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // After logout, the token should be invalid (401 Unauthorized)
  expect(testResponse.status).toBe(401);
});

// TC_API_ADMIN_DASH_07 - Verify Admin Access Sales List
Then(
  "the response should contain sales list",
  async function (this: CustomWorld) {
    const responseBody = this.parameters["apiResponseBody"];

    // Verify it's an array
    expect(Array.isArray(responseBody)).toBeTruthy();

    // If array has items, verify first item has sales properties
    if (responseBody.length > 0) {
      const firstSale = responseBody[0];
      expect(firstSale).toHaveProperty("id");
      // Sales typically have plantId and quantity
      expect(firstSale).toHaveProperty("plantId");
    }
    // If array is empty, that's also valid - it just means no sales exist yet
  },
);
