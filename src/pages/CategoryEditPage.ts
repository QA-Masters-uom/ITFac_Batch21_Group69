import { BasePage } from "./BasePage";
import { Page, Locator } from "playwright";
import { expect } from "@playwright/test";
import { config } from "../support/config";

export class CategoryEditPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private pageTitle = 'h3:has-text("Edit Category")';
  private nameInput = "#name";
  private parentIdSelect = "#parentId";
  private saveButton = 'button:has-text("Save")';
  private cancelButton = 'a:has-text("Cancel")';

  async navigateToEditCategory(categoryId: number) {
    await this.navigateTo(
      `${config.uiBaseUrl}/ui/categories/edit/${categoryId}`,
    );
  }

  async isEditCategoryPageVisible(): Promise<boolean> {
    return await this.page.isVisible(this.pageTitle).catch(() => false);
  }

  async verifyPageTitle() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
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

  async getCategoryNameValue(): Promise<string | null> {
    return await this.page.inputValue(this.nameInput);
  }
}
