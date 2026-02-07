import { BasePage } from './BasePage';
import { Page } from 'playwright';
import { expect } from '@playwright/test';

export class CategoryAddPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private pageTitle = 'h3:has-text("Add Category")';
  private nameInput = '#name';
  private parentIdSelect = '#parentId';
  private saveButton = 'button:has-text("Save")';
  private cancelButton = 'a:has-text("Cancel")';

  async navigateToAddCategory() {
    await this.navigateTo('http://localhost:8081/ui/categories/add');
  }

  async isAddCategoryPageVisible(): Promise<boolean> {
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
}
