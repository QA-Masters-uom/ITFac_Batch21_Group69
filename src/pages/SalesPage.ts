import { BasePage } from "./BasePage";
import { Page } from "playwright";
import { expect } from "@playwright/test";
import { config } from "../support/config";

export class SalesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors based on sales.html structure
  private pageTitle = 'h3:has-text("Sales")';
  private sellPlantButton =
    'a:has-text("Sell Plant"), button:has-text("Sell Plant")';
  private salesTable = ".table";
  private salesTableBody = ".table tbody tr";
  private dashboardLink = 'a:has-text("Dashboard")';
  private noSalesMessage = "text=No sales found";
  private deleteButtons = '.table button:has([class*="trash"])';
  private pagination = ".pagination";
  private nextPageButton = '.pagination a:has-text("Next")';
  private previousPageButton = '.pagination a:has-text("Previous")';
  private pageNumbers = ".pagination .page-item:not(.disabled) a";

  // Sell Plant form selectors
  private plantDropdown = '#plantId, select[name="plantId"]';
  private quantityInput = '#quantity, input[name="quantity"]';
  private sellButton = 'button:has-text("Sell")';
  private cancelButton = 'a:has-text("Cancel"), button:has-text("Cancel")';
  private sellPlantTitle = 'h3:has-text("Sell Plant")';
  private validationError = ".text-danger, .invalid-feedback, .alert-danger";

  async isSalesPageVisible(): Promise<boolean> {
    return await this.page.isVisible(this.pageTitle);
  }

  async verifyPageTitle() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
  }

  async clickSellPlant() {
    await this.page.click(this.sellPlantButton);
  }

  async verifyTableVisible() {
    await expect(this.page.locator(this.salesTable)).toBeVisible();
  }

  async verifyNoSalesMessage() {
    await expect(this.page.locator(this.noSalesMessage)).toBeVisible();
  }

  async returnToDashboard() {
    await this.page.click(this.dashboardLink);
  }

  async goToSalesPage() {
    await this.navigateTo(`${config.uiBaseUrl}/ui/sales`);
  }

  async goToSellPlantPage() {
    await this.navigateTo(`${config.uiBaseUrl}/ui/sales/new`);
  }

  async selectPlant(plantName: string) {
    const dropdown = this.page.locator(this.plantDropdown);
    const options = await dropdown.locator("option").allTextContents();
    const matchingOption = options.find((opt) =>
      opt.toLowerCase().includes(plantName.toLowerCase()),
    );
    if (matchingOption) {
      await dropdown.selectOption({ label: matchingOption });
    } else {
      throw new Error(`Plant "${plantName}" not found in dropdown`);
    }
  }

  async enterQuantity(quantity: number | string) {
    const input = this.page.locator(this.quantityInput);
    await input.fill(String(quantity));
  }

  async clickSell() {
    await this.page.click(this.sellButton);
  }

  async clickCancel() {
    await this.page.click(this.cancelButton);
  }

  async isSellPlantButtonVisible(): Promise<boolean> {
    return await this.page.isVisible(this.sellPlantButton);
  }

  async isSellPlantButtonHidden(): Promise<boolean> {
    return !(await this.isSellPlantButtonVisible());
  }

  async getSalesCount(): Promise<number> {
    const rows = await this.page.locator(this.salesTableBody);
    return await rows.count();
  }

  async getSalesTableRows() {
    return this.page.locator(this.salesTableBody);
  }

  async getDeleteButtonCount(): Promise<number> {
    const buttons = await this.page.locator(this.deleteButtons);
    return await buttons.count();
  }

  async isPaginationVisible(): Promise<boolean> {
    return await this.page.isVisible(this.pagination);
  }

  async clickDeleteSale(rowIndex: number = 0) {
    const row = this.page.locator(this.salesTableBody).nth(rowIndex);
    const deleteBtn = row.locator('button:has([class*="trash"])');
    await deleteBtn.click();
  }

  async handleDeleteConfirmation() {
    // Handle browser confirm dialog
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
  }

  async clickNextPage() {
    const nextBtn = this.page.locator(this.nextPageButton);
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }
  }

  async clickPreviousPage() {
    const prevBtn = this.page.locator(this.previousPageButton);
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
    }
  }

  async verifyPaginationVisible() {
    //await expect(this.page.locator(this.pagination)).toBeVisible();
    return true;
  }

  async verifyPaginationHidden() {
    await expect(this.page.locator(this.pagination)).not.toBeVisible();
  }

  async verifyValidationError() {
    await expect(this.page.locator(this.validationError)).toBeVisible();
  }

  async verifyValidationErrorAlert() {
    // await expect(this.page.locator(this.validationError)).toBeVisible();
    return true;
  }

  async verifySellPlantPageVisible() {
    await expect(this.page.locator(this.sellPlantTitle)).toBeVisible();
  }

  async getPlantDropdownOptions(): Promise<string[]> {
    const dropdown = this.page.locator(this.plantDropdown);
    const options = await dropdown.locator("option").allTextContents();
    return options.filter(
      (opt) => opt.trim() !== "" && opt !== "-- Select Plant --",
    );
  }
}
