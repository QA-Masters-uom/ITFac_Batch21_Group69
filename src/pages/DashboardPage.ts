import { BasePage } from './BasePage';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors based on "Inspect Dashboard" findings
    // Cards are likely containing text "Categories", "Plants", etc.
    private categoriesCard = '//div[contains(text(), "Categories")]/..';
    private plantsCard = '//div[contains(text(), "Plants")]/..';
    private salesCard = '//div[contains(text(), "Sales")]/..';
    private inventoryCard = '//div[contains(text(), "Inventory")]/..';

    private manageCategoriesBtn = 'text=Manage Categories';
    private managePlantsBtn = 'text=Manage Plants';
    private viewSalesBtn = 'text=View Sales';
    private openInventoryBtn = 'text=Open Inventory';

    async isDashboardVisible() {
        // Check for the "Dashboard" heading or a sidebar element
        return await this.page.isVisible('text=QA Training Application');
    }

    async verifyCardsVisible() {
        // We expect 4 cards
        // Using loose text matching to be robust against DOM structure
        await expect(this.page.locator('text=Categories')).toBeVisible();
        await expect(this.page.locator('text=Plants')).toBeVisible();
        await expect(this.page.locator('text=Sales')).toBeVisible();
        await expect(this.page.locator('text=Inventory')).toBeVisible(); // Or "Stock"
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
        await this.page.click(this.openInventoryBtn);
    }

    async verifyLowStockIndicator() {
        // "Low Stock" text should be present in Plants card
        await expect(this.page.locator('text=Low Stock')).toBeVisible();
    }
}
