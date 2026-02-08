import { BasePage } from "./BasePage";
import { Page } from "playwright";
import { expect } from "@playwright/test";
import { config } from "../support/config";

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
  private categoriesTable = ".table";
  private dashboardLink = 'a:has-text("Dashboard")';

  // Form selectors (from categories.new.html and categories.edit.html)
  private nameInput = "#name";
  private parentIdSelect = "#parentId";
  private saveButton = 'button:has-text("Save")';
  private cancelButton = 'a:has-text("Cancel")';

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
    const addButton = this.page.locator(this.addCategoryButton);
    if (await addButton.isVisible()) {
      await addButton.click();
    } else {
      throw new Error("Add A Category button is not visible");
    }
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

  async addCategory(categoryName: string) {
    await this.clickAddCategory();
    await this.page.fill(this.nameInput, categoryName);
    await this.page.click(this.saveButton);
  }

  async fillCategoryName(categoryName: string) {
    await this.page.fill(this.nameInput, categoryName);
  }

  async selectParent(parentId: string) {
    await this.page.selectOption(this.parentIdSelect, parentId);
  }

  async clickSave() {
    await this.page.click(this.saveButton);
  }

  async clickCancel() {
    await this.page.click(this.cancelButton);
  }

  async rowByCategoryName(categoryName: string) {
    return this.page.locator("tbody tr").filter({ hasText: categoryName });
  }

  async expectCategoryVisible(categoryName: string) {
    const row = await this.rowByCategoryName(categoryName);
    await expect(row.first()).toBeVisible();
  }

  async expectCategoryNotVisible(categoryName: string) {
    const row = await this.rowByCategoryName(categoryName);
    await expect(row).not.toBeVisible();
  }

  async deleteCategory(categoryName: string) {
    const row = await this.rowByCategoryName(categoryName);
    const deleteButton = row.locator('button[title="Delete"]').first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      // Handle confirmation
      await this.page.click('button:has-text("Delete")');
    }
  }

  async editCategory(categoryName: string, newName: string) {
    const row = await this.rowByCategoryName(categoryName);
    const editButton = row.locator('a[title="Edit"]').first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await this.page.fill(this.nameInput, newName);
      await this.page.click(this.saveButton);
    }
  }
}
