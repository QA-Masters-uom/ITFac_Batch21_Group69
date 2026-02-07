import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { PlantsPage } from "../pages/PlantsPage";

type PlantData = {
  name: string;
  category: string;
  price: string;
  quantity: string;
};

function tableToPlant(table: any): PlantData {
  const row = table.hashes()[0];
  return {
    name: row.name,
    category: row.category,
    price: row.price,
    quantity: row.quantity,
  };
}

async function openPlants(world: CustomWorld) {
  const plants = new PlantsPage(world.page!);
  await plants.gotoManagePlants();
  await plants.expectListVisible();
  return plants;
}

When('I go to the "Plants" management page', async function (this: CustomWorld) {
  await openPlants(this);
});

When("I add a new plant with:", async function (this: CustomWorld, table: any) {
  const plants = await openPlants(this);
  const data = tableToPlant(table);
  await plants.addPlant(data);
});


Given('a plant exists named {string}', async function (this: CustomWorld, name: string) {
  const plants = await openPlants(this);
  console.log("plant name is ", name);

  const exists = await plants.rowByPlantName(name).first().isVisible().catch(() => false);
  if (exists) return;

  // create a default one
  await plants.addPlant({
    name,
    category: "Orchid",
    price: "1000",
    quantity: "10",
  });
});

Given(
  'a plant exists named {string} in category {string}',
  async function (this: CustomWorld, name: string, category: string) {
    const plants = await openPlants(this);

    // Check if any row contains both the name and the category text
    const rows = this.page!.locator("tbody tr").filter({ hasText: name }).filter({ hasText: category });
    if ((await rows.count()) > 0) return;

    await plants.addPlant({
      name,
      category,
      price: "900",
      quantity: "15",
    });
  }
);

When('I delete plant {string}', async function (this: CustomWorld, name: string) {
  const plants = await openPlants(this);
  await plants.deletePlant(name);
});

Then(
  'I should not see the plant {string} in the plant list',
  async function (this: CustomWorld, name: string) {
    const plants = await openPlants(this);
    await plants.expectPlantNotVisible(name);
  }
);

Then("I should see a plant validation error", async function (this: CustomWorld) {
  const plants = new PlantsPage(this.page!);
  await plants.expectValidationError();
});

Then(
  'there should be only 1 plant named {string} in category {string}',
  async function (this: CustomWorld, name: string, category: string) {
    await openPlants(this);
    const rows = this.page!.locator("tbody tr").filter({ hasText: name }).filter({ hasText: category });
    await expect(rows).toHaveCount(1);
  }
);

When('I search plants for {string}', async function (this: CustomWorld, term: string) {
  const plants = new PlantsPage(this.page!);
  await plants.search(term);
});

Then('only plants matching {string} should be shown', async function (this: CustomWorld, term: string) {
  const rows = this.page!.locator("tbody tr");
  const n = await rows.count();

  for (let i = 0; i < n; i++) {
    const text = (await rows.nth(i).innerText()).toLowerCase();
    expect(text).toContain(term.toLowerCase());
  }
});

When('I edit plant {string} to:', async function (this: CustomWorld, oldName: string, table: any) {
  const plants = new PlantsPage(this.page!);
  const row = table.hashes()[0];

  await plants.gotoManagePlants();
  await plants.expectListVisible();

  await plants.editPlant(oldName, {
    name: row.name,
    category: row.category,
    price: row.price,
    quantity: row.quantity,
  });

  // wait until updated name appears
  await plants.gotoManagePlants();
  await this.page!.waitForSelector(`tbody tr:has-text("${row.name}")`, { timeout: 10000 });
});

Then('I should see the plant {string} in the plant list', async function (this: CustomWorld, name: string) {
  const plants = new PlantsPage(this.page!);

  await plants.gotoManagePlants();
  await plants.expectListVisible();
  await this.page!.waitForSelector(`tbody tr:has-text("${name}")`, { timeout: 10000 });

  await plants.expectPlantVisible(name);
});



