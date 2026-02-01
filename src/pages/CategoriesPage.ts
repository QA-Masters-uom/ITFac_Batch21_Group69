import { BasePage } from './BasePage';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

export class CategoriesPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors based on categories.html structure
    private pageTitle = 'h3:has-text("Categories")';
    private searchInput = 'input[placeholder="Search sub category"]';
    private parentFilterSelect = 'select[name="parentId"]';
    private searchButton = 'button:has-text("Search")';
    private resetButton = 'a:has-text("Reset")';
    private addCategoryButton = 'a:has-text("Add A Category")';
    private categoriesTable = '.table';
    private dashboardLink = 'a:has-text("Dashboard")';

    async isCategoriesPageVisible(): Promise<boolean> {
        return await this.page.isVisible(this.pageTitle);
    }

    async verifyPageTitle() {
        await expect(this.page.locator(this.pageTitle)).toBeVisible();
    }

    async searchCategory(categoryName: string) {
        await this.page.fill(this.searchInput, categoryName);
        await this.page.click(this.searchButton);
    }

    async resetSearch() {
        await this.page.click(this.resetButton);
    }

    async clickAddCategory() {
        await this.page.click(this.addCategoryButton);
    }

    async filterByParent(parentId: string) {
        await this.page.selectOption(this.parentFilterSelect, parentId);
    }

    async verifyTableVisible() {
        await expect(this.page.locator(this.categoriesTable)).toBeVisible();
    }

    async returnToDashboard() {
        await this.page.click(this.dashboardLink);
    }
}
