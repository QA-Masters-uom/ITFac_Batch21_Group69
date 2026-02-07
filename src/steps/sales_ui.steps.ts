import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { SalesPage } from "../pages/SalesPage";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8081";

// ============ GIVEN STEPS ============

Given('I go to the "Sales" page', async function (this: CustomWorld) {
  const sales = new SalesPage(this.page!);
  await sales.goToSalesPage();
  await new Promise((r) => setTimeout(r, 500)); // Wait for page load
});

// ============ WHEN STEPS ============

When(
  "I navigate to {string}",
  async function (this: CustomWorld, path: string) {
    await this.page!.goto(`${BASE_URL}/${path}`);
    this.parameters["lastNavigationPath"] = path;
  },
);

When(
  "I select plant {string} from dropdown",
  async function (this: CustomWorld, plantName: string) {
    const sales = new SalesPage(this.page!);
    await sales.selectPlant(plantName);
  },
);

When(
  "I enter quantity {string}",
  async function (this: CustomWorld, quantity: string) {
    const sales = new SalesPage(this.page!);
    await sales.enterQuantity(quantity);
  },
);

When("I click Sell", async function (this: CustomWorld) {
  const sales = new SalesPage(this.page!);
  await sales.clickSell();
  await new Promise((r) => setTimeout(r, 1000)); // Wait for form submission
});

When(
  "I delete the first sale from the list",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    const initialCount = await sales.getSalesCount();
    this.parameters["initialSalesCount"] = initialCount;

    // Set up dialog handler before clicking delete
    this.page!.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await sales.clickDeleteSale(0);
    await new Promise((r) => setTimeout(r, 1000)); // Wait for deletion
  },
);

When(
  "I try to access the sales delete URL",
  async function (this: CustomWorld) {
    // Try to access a delete URL directly
    await this.page!.goto(`${BASE_URL}/ui/sales/delete/1`, {
      waitUntil: "networkidle",
    });
  },
);

When("I can navigate to the next page", async function (this: CustomWorld) {
  const sales = new SalesPage(this.page!);
  const initialUrl = this.page!.url();
  await sales.clickNextPage();
  await new Promise((r) => setTimeout(r, 500)); // Wait for navigation
  // Verify we actually navigated
  const newUrl = this.page!.url();
  expect(newUrl).not.toBe(initialUrl);
});

When("I can navigate to the previous page", async function (this: CustomWorld) {
  const sales = new SalesPage(this.page!);
  const initialUrl = this.page!.url();
  await sales.clickPreviousPage();
  await new Promise((r) => setTimeout(r, 500)); // Wait for navigation
});

// ============ THEN STEPS ============

Then(
  "the {string} page should be visible",
  async function (this: CustomWorld, pageName: string) {
    const sales = new SalesPage(this.page!);
    if (pageName === "Sales") {
      await sales.verifyPageTitle();
    } else if (pageName === "Sell Plant") {
      await sales.verifySellPlantPageVisible();
    }
  },
);

Then("the sales table should be visible", async function (this: CustomWorld) {
  const sales = new SalesPage(this.page!);
  await sales.verifyTableVisible();
});

Then(
  "pagination controls should be visible",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    await sales.verifyPaginationVisible();
  },
);

Then(
  "pagination controls should not be visible",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    await sales.verifyPaginationHidden();
  },
);

Then(
  "validation error should be displayed",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    await sales.verifyValidationError();
  },
);

Then(
  "validation error alert box should be displayed",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    await sales.verifyValidationErrorAlert();
  },
);

Then(
  "I should be redirected to sales list page",
  async function (this: CustomWorld) {
    await new Promise((r) => setTimeout(r, 500)); // Wait for redirect
    const currentUrl = this.page!.url();
    expect(currentUrl).toContain("/ui/sales");
    expect(currentUrl).not.toContain("/ui/sales/new");
  },
);

Then(
  "the sale should be visible in the list",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    const count = await sales.getSalesCount();
    expect(count).toBeGreaterThan(0);
  },
);

Then(
  "the {string} plant should not be in the dropdown",
  async function (this: CustomWorld, plantName: string) {
    const sales = new SalesPage(this.page!);
    const options = await sales.getPlantDropdownOptions();

    // Filter for exact plant name match
    const found = options.some((opt) =>
      opt.trim().toUpperCase().startsWith(plantName.toUpperCase()),
    );

    expect(found).toBeFalsy();
  },
);

Then(
  "the sale count should decrease by one",
  async function (this: CustomWorld) {
    const sales = new SalesPage(this.page!);
    const initialCount = this.parameters["initialSalesCount"];
    const finalCount = await sales.getSalesCount();

    expect(finalCount).toBe(initialCount - 1);
  },
);

Then(
  "I should not see delete option for sales",
  async function (this: CustomWorld) {
    // Check that no delete buttons are visible in the sales table
    const deleteButtons = await this.page!.locator(
      'form[action*="/ui/sales/delete"] button',
    ).count();
    expect(deleteButtons).toBe(0);
  },
);
