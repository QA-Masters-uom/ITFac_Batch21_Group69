import { expect } from '@playwright/test';
import { Page } from 'playwright';
import { BasePage } from './BasePage';

type PlantForm = {
  name: string;
  category: string;
  price: string;
  quantity: string;
};

export class PlantsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- URLs (adjust if different)
  async gotoManagePlants() {
    await this.page.goto('http://localhost:8081/ui/plants');
    await this.page.waitForLoadState('networkidle');
  }

  private addPlantBtn = this.page.locator('text=Add a Plant');
  private confirmDeleteBtn = this.page.getByRole('button', { name: /confirm/i });

  private plantNameInput = this.page.locator('#name');
  private categorySelect = this.page.locator('#categoryId');
  private priceInput = this.page.locator('#price');
  private quantityInput = this.page.locator('#quantity');

  private saveBtn = this.page.locator('button:has-text("Save")');

  private searchInput = this.page.locator('input[placeholder*="Search"], input[name="search"]');
  private searchBtn = this.page.getByRole('button', { name: /search/i });

  private errorToast = this.page.locator('.toast-error, .alert-danger, text=/already exists|duplicate|error/i');

  rowByPlantName(name: string) {
    return this.page.locator('tbody tr', { hasText: name });
  }

  async openAddPlantForm() {
    await this.addPlantBtn.waitFor({ state: 'visible' });
    await this.addPlantBtn.click();
    await this.page.waitForSelector('text=Add Plant');
  }

  async addPlant(data: PlantForm) {
    if (await this.addPlantBtn.count()) {
      await this.openAddPlantForm();
    }
    await this.plantNameInput.fill(data.name);
    // await this.categorySelect.selectOption('1');
    await this.categorySelect.selectOption({ label: data.category }).catch(async () => {
      await this.categorySelect.selectOption(data.category);
    });
    await this.priceInput.fill(String(data.price));
    await this.quantityInput.fill(String(data.quantity));
    await this.saveBtn.click();
    await this.page.waitForSelector('text=Plants');
  }

  async editPlant(oldName: string, data: PlantForm) {
    const row = this.page.locator('tbody tr').filter({ hasText: oldName });
    await expect(row).toBeVisible();
    await row.locator('a[title="Edit"]').click();
    await this.page.waitForURL(/\/ui\/plants\/edit\/\d+/);
    await this.plantNameInput.fill(data.name);
    // await this.categorySelect.selectOption('3');
    await this.categorySelect.selectOption({ label: data.category }).catch(async () => {
      await this.categorySelect.selectOption(data.category);
    });

    await this.priceInput.fill(String(data.price));
    await this.quantityInput.fill(String(data.quantity));
    await this.saveBtn.click();
    await this.page.waitForURL(/\/ui\/plants/);
  }

  async deletePlant(name: string) {
    await this.page.waitForSelector('table');
    await this.page.waitForLoadState('domcontentloaded');

    const row = this.page.locator('tbody tr', { hasText: name });
    const rowCount = await row.count();

    if (rowCount === 0) {
      throw new Error(`Plant row not found: "${name}"`);
    }

    const deleteBtn = row.locator('a[title="Delete"], button[title="Delete"], [aria-label="Delete"], [data-testid*="delete"]').first();
    await expect(deleteBtn).toBeVisible({ timeout: 15000 });

    let dialogSeen = false;
    this.page.once('dialog', async (dialog) => {
      dialogSeen = true;
      await dialog.accept();
    });

    await deleteBtn.click();

    if (!dialogSeen && (await this.confirmDeleteBtn.count()) > 0) {
      await this.confirmDeleteBtn.click();
    }

    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('tbody tr', { hasText: name })).toHaveCount(0, { timeout: 15000 });
  }

  async search(name: string) {
    await this.searchInput.fill(name);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectPlantVisible(name: string) {
    await expect(this.rowByPlantName(name)).toBeVisible();
  }

  async expectPlantNotVisible(name: string) {
    await expect(this.rowByPlantName(name)).toHaveCount(0);
  }

  async expectValidationError() {
    // Prefer the container alert (single element)
    const alert = this.page.locator('.alert.alert-danger').first();

    // Or fallback to a text match (pick first match)
    const text = this.page.getByText(/already exists|duplicate|error/i).first();

    // Pass if either is visible
    const alertVisible = await alert.isVisible().catch(() => false);
    const textVisible = await text.isVisible().catch(() => false);

    if (!alertVisible && !textVisible) {
      // give it a little time before failing
      await expect(alert.or(text)).toBeVisible({ timeout: 10000 });
    }
  }


  async expectListVisible() {
    await expect(this.page.locator('table, .plant-list')).toBeVisible();
  }

  async expectOptionHiddenOrDisabled(label: 'Add a Plant' | 'Edit' | 'Delete') {
    const button = this.page.getByRole('button', { name: new RegExp(label, 'i') });

    // If it exists, must be disabled. If not, also acceptable.
    const count = await button.count();
    if (count === 0) return;

    await expect(button.first()).toBeDisabled();
  }
}
