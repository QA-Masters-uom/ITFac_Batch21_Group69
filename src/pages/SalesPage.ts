import { BasePage } from './BasePage';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

export class SalesPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors based on sales.html structure
    private pageTitle = 'h3:has-text("Sales")';
    private sellPlantButton = 'a:has-text("Sell Plant")';
    private salesTable = '.table';
    private dashboardLink = 'a:has-text("Dashboard")';
    private noSalesMessage = 'text=No sales found';

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
}
