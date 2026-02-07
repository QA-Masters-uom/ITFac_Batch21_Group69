import { When, Then , Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { PlantsPage } from "../pages/PlantsPage";
import { request } from "@playwright/test";

async function openPlants(world: CustomWorld) {
  const plants = new PlantsPage(world.page!);
  await plants.gotoManagePlants();      // same URL: /ui/plants
  await plants.expectListVisible();
  return plants;
}

When('I go to the "Plants" page', async function (this: CustomWorld) {
  await openPlants(this);
});

Then("I should see the plant list", async function (this: CustomWorld) {
  const plants = new PlantsPage(this.page!);
  await plants.expectListVisible();

  // optional: also verify the page heading
  await expect(this.page!.locator('h3:has-text("Plants")')).toBeVisible();
});

Then(
  'the {string} option should be hidden or disabled',
  async function (this: CustomWorld, option: string) {
    const plants = new PlantsPage(this.page!);
    await plants.expectOptionHiddenOrDisabled(option as any);
  }
);

Given('a plant exists named {string} for user scenarios', async function (this: CustomWorld, name: string) {
    const plants = await openPlants(this);
    await plants.addPlant({
        name,
        category: "Orchid",
        price: "1000",
        quantity: "10",
    });

});
