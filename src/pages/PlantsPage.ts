import { BasePage } from './BasePage';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

export class PlantsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors based on plants.html structure
    private pageTitle = 'h3:has-text("Plants")';
    private searchInput = 'input[placeholder="Search plant"]';
    private categoryFilterSelect = 'select[name="categoryId"]';
    private searchButton = 'button:has-text("Search")';
    private resetButton = 'a:has-text("Reset")';
    private addPlantButton = 'a:has-text("Add a Plant")';
    private plantsTable = '.table';
    private dashboardLink = 'a:has-text("Dashboard")';

    async isPlantsPageVisible(): Promise<boolean> {
        return await this.page.isVisible(this.pageTitle);
    }

    async verifyPageTitle() {
        await expect(this.page.locator(this.pageTitle)).toBeVisible();
    }

    async searchPlant(plantName: string) {
        await this.page.fill(this.searchInput, plantName);
        await this.page.click(this.searchButton);
    }

    async resetSearch() {
        await this.page.click(this.resetButton);
    }

    async clickAddPlant() {
        await this.page.click(this.addPlantButton);
    }

    async filterByCategory(categoryId: string) {
        await this.page.selectOption(this.categoryFilterSelect, categoryId);
    }

    async verifyTableVisible() {
        await expect(this.page.locator(this.plantsTable)).toBeVisible();
    }

    async returnToDashboard() {
        await this.page.click(this.dashboardLink);
    }
}
