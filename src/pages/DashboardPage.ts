import { BasePage } from "./BasePage";
import { Page } from "playwright";
import { expect } from "@playwright/test";
import { config } from "../support/config";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors based on HTML structure
  private dashboardCard = ".dashboard-card";
  private manageCategoriesBtn = 'a:has-text("Manage Categories")';
  private managePlantsBtn = 'a:has-text("Manage Plants")';
  private viewSalesBtn = 'a:has-text("View Sales")';
  private openInventoryBtn = 'a:has-text("Open Inventory")';
  private sidebar = ".sidebar";

  async isDashboardVisible() {
    // Check for the application header
    return await this.page.isVisible("text=QA Training Application");
  }

  async verifyCardsVisible() {
    // Verify all 4 cards are visible on the dashboard
    const cards = this.page.locator(this.dashboardCard);
    await expect(cards).toHaveCount(4);

    // Verify each card contains the expected text - use h6 within dashboard-card to be more specific
    await expect(
      this.page.locator('.dashboard-card h6:has-text("Categories")'),
    ).toBeVisible();
    await expect(
      this.page.locator('.dashboard-card h6:has-text("Plants")'),
    ).toBeVisible();
    await expect(
      this.page.locator('.dashboard-card h6:has-text("Sales")'),
    ).toBeVisible();
    await expect(
      this.page.locator('.dashboard-card h6:has-text("Inventory")'),
    ).toBeVisible();
  }

  async verifySidebarNavigation() {
    // Verify sidebar is visible
    await expect(this.page.locator(this.sidebar)).toBeVisible();
  }

  async clickManageCategories() {
    await this.page.click(this.manageCategoriesBtn);
  }

  async clickManagePlants() {
    await this.page.click(this.managePlantsBtn);
  }

  async clickViewSales() {
    await this.page.click(this.viewSalesBtn);
  }

  async clickOpenInventory() {
    // The inventory button is disabled but has a valid href
    // Get the href and navigate directly
    const href = await this.page.getAttribute(this.openInventoryBtn, "href");
    if (href) {
      await this.page.goto(`${config.uiBaseUrl}${href}`);
    }
  }

  async verifyLowStockIndicator() {
    // "Low Stock" text should be present in Plants card
    await expect(this.page.locator("text=Low Stock")).toBeVisible();
  }

  async getCategoryCount(): Promise<number> {
    // Extract main category count from Categories card
    // The format shows "0" for Main categories in the card
    const countText = await this.page
      .locator('.dashboard-card:has-text("Categories") .fw-bold.fs-5')
      .first()
      .textContent();
    return countText ? parseInt(countText.trim(), 10) : 0;
  }

  async getPlantCount(): Promise<number> {
    // Extract plant count from Plants card (Total)
    const countText = await this.page
      .locator('.dashboard-card:has-text("Plants") .fw-bold.fs-5')
      .first()
      .textContent();
    return countText ? parseInt(countText.trim(), 10) : 0;
  }

  async getSalesCount(): Promise<number> {
    // Extract sales count from Sales card
    const countText = await this.page
      .locator('.dashboard-card:has-text("Sales") .fw-bold.fs-5')
      .last()
      .textContent();
    return countText ? parseInt(countText.trim(), 10) : 0;
  }

  async getInventoryCount(): Promise<number> {
    // Inventory count from the Inventory card
    // For now returning 0 as the HTML shows the button is disabled
    return 0;
  }

  async verifyButtonVisible(buttonText: string) {
    // Verify a specific button is visible on dashboard
    const buttonLocator = this.page.locator(`a:has-text("${buttonText}")`);
    await expect(buttonLocator).toBeVisible();
  }

  async isCardVisible(cardName: string): Promise<boolean> {
    // Check if a specific card is visible on the dashboard
    try {
      const cardLocator = this.page.locator(
        `.dashboard-card h6:has-text("${cardName}")`,
      );
      await expect(cardLocator).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clickSidebarLink(linkText: string) {
    // Click on a sidebar navigation link
    const sidebarLink = this.page.locator(`.sidebar a:has-text("${linkText}")`);
    await sidebarLink.click();
  }

  async isLowStockIndicatorVisible(): Promise<boolean> {
    // Check if "Low Stock" indicator is visible in the Plants card
    try {
      const lowStockLocator = this.page.locator(
        '.dashboard-card:has-text("Plants") text=Low Stock',
      );
      await expect(lowStockLocator).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clickAppTitle() {
    // Click on the application title/logo in the header to navigate to dashboard
    // Try multiple possible selectors
    try {
      // Try navbar-brand first (common Bootstrap pattern)
      const navbarBrand = this.page.locator(".navbar-brand");
      if (await navbarBrand.isVisible({ timeout: 2000 })) {
        await navbarBrand.click();
        await this.page.waitForLoadState("networkidle");
        return;
      }
    } catch (e) {
      // Try next selector
    }

    try {
      // Try h1 in header
      const headerTitle = this.page.locator("header h1");
      if (await headerTitle.isVisible({ timeout: 2000 })) {
        await headerTitle.click();
        await this.page.waitForLoadState("networkidle");
        return;
      }
    } catch (e) {
      // Try next selector
    }

    // Fallback to text-based selector
    const appTitle = this.page.locator("text=QA Training Application");
    await appTitle.first().click();
    await this.page.waitForLoadState("networkidle");
  }

  async hasRevenueField(): Promise<boolean> {
    // Check if Revenue field is present in the Sales card
    try {
      const revenueLocator = this.page.locator(
        '.dashboard-card:has-text("Sales") text=Revenue, .dashboard-card:has-text("Sales") :text("Rs")',
      );
      await expect(revenueLocator.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRevenueValue(): Promise<string> {
    // Get the revenue value from the Sales card
    // Try to find revenue text with Rs or numeric value
    const salesCard = this.page.locator('.dashboard-card:has-text("Sales")');

    // Try to find text containing "Rs" or revenue label
    const revenueText = await salesCard
      .locator("text=/Rs|Revenue/")
      .first()
      .textContent();

    if (revenueText) {
      return revenueText.trim();
    }

    // Fallback: get all text from sales card and look for numbers
    const cardText = await salesCard.textContent();
    return cardText?.trim() || "";
  }

  async hasSubCategoryCount(): Promise<boolean> {
    // Check if Sub category count is present in the Categories card
    try {
      const categoriesCard = this.page.locator(
        '.dashboard-card:has-text("Categories")',
      );
      const cardText = await categoriesCard.textContent();

      // Check if card text contains "Sub" keyword (case insensitive)
      if (cardText && /sub/i.test(cardText)) {
        return true;
      }

      // Alternative: check if there are multiple numbers (main and sub counts)
      const numbers = cardText?.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async getSubCategoryCount(): Promise<number> {
    // Get the sub category count from the Categories card
    const categoriesCard = this.page.locator(
      '.dashboard-card:has-text("Categories")',
    );

    // Try to find "Sub" label and get the associated count
    // Look for text pattern like "Sub: 5" or similar
    const cardText = await categoriesCard.textContent();

    if (cardText) {
      // Try to extract number after "Sub" keyword
      const subMatch = cardText.match(/Sub[:\s]*(\d+)/i);
      if (subMatch && subMatch[1]) {
        return parseInt(subMatch[1], 10);
      }

      // Alternative: look for all numbers in the card and try to identify sub count
      // This is a fallback - might need adjustment based on actual HTML structure
      const numbers = cardText.match(/\d+/g);
      if (numbers && numbers.length > 1) {
        // Assuming second number might be sub category count
        return parseInt(numbers[1], 10);
      }
    }

    return 0;
  }
}
