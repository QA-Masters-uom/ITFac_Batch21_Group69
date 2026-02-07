import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { CategoryAddPage } from "../pages/CategoryAddPage";
import { CategoryEditPage } from "../pages/CategoryEditPage";

const BASE_URL = process.env.UI_BASE_URL ?? "http://localhost:8081";
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8081";

// ============ API HELPER FUNCTIONS ============

function authHeaders(world: CustomWorld, tokenKey: string = "adminToken") {
  const token = world.parameters[tokenKey];
  if (!token)
    throw new Error(`No token found in world.parameters['${tokenKey}']`);
  return { Authorization: `Bearer ${token}` };
}

async function loginAndGetToken(world: CustomWorld, role: "admin" | "normal") {
  const username = role === "admin" ? "admin" : "user";
  const password = role === "admin" ? "admin123" : "user123";

  const res = await world.page!.request.post(`${API_BASE_URL}/api/auth/login`, {
    data: { username, password },
  });

  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.token as string;
}

async function ensureAdminToken(world: CustomWorld) {
  if (!world.parameters["adminToken"]) {
    world.parameters["adminToken"] = await loginAndGetToken(world, "admin");
  }
}

async function findCategoryByName(
  world: CustomWorld,
  categoryName: string,
  tokenKey: string = "adminToken",
) {
  const res = await world.page!.request.get(`${API_BASE_URL}/api/categories`, {
    headers: authHeaders(world, tokenKey),
  });

  expect(res.status()).toBe(200);
  const categories = await res.json();
  const list = Array.isArray(categories) ? categories : (categories.data ?? []);

  const found = list.find(
    (c: any) => String(c.name).toLowerCase() === categoryName.toLowerCase(),
  );
  return found;
}

async function deleteCategory(
  world: CustomWorld,
  categoryId: number,
  tokenKey: string = "adminToken",
) {
  const res = await world.page!.request.delete(
    `${API_BASE_URL}/api/categories/${categoryId}`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function openCategories(world: CustomWorld) {
  const categories = new CategoriesPage(world.page!);
  await categories.navigateTo(`${BASE_URL}/ui/categories`);
  await categories.verifyTableVisible();
  return categories;
}

async function getCategoryRowByName(world: CustomWorld, categoryName: string) {
  return world.page!.locator("tbody tr").filter({ hasText: categoryName });
}

Given(
  "a category exists named {string}",
  async function (this: CustomWorld, categoryName: string) {
    // Navigate to categories page
    const categories = await openCategories(this);

    // Check if category already exists
    const row = await getCategoryRowByName(this, categoryName);
    if ((await row.count()) > 0) return;

    // Add category
    await categories.clickAddCategory();
    await expect(this.page!).toHaveURL(/\/ui\/categories\/add/, {
      timeout: 5000,
    });

    // Fill form
    await this.page!.fill('input[name="name"]', categoryName);

    // Submit form
    await this.page!.click('button:has-text("Save")');

    // Wait for redirect to categories page
    await expect(this.page!).toHaveURL(/\/ui\/categories/, { timeout: 5000 });
  },
);

Given(
  "no category exists named {string}",
  async function (this: CustomWorld, categoryName: string) {
    // Use API to delete if exists (avoids UI timeout issues)
    await ensureAdminToken(this);

    const category = await findCategoryByName(this, categoryName, "adminToken");

    if (category) {
      await deleteCategory(this, category.id, "adminToken");
    }
  },
);

When(
  'I go to the "Categories" management page',
  async function (this: CustomWorld) {
    await openCategories(this);
  },
);

When(
  "I click the {string} button",
  async function (this: CustomWorld, buttonText: string) {
    const button = this.page!.locator(
      `a:has-text("${buttonText}"), button:has-text("${buttonText}")`,
    );
    await button.first().click();
  },
);

Then(
  "the {string} Category page should be visible",
  async function (this: CustomWorld, pageName: string) {
    if (pageName === "Add") {
      await expect(this.page!).toHaveURL(/\/ui\/categories\/add/, {
        timeout: 5000,
      });
    } else if (pageName === "Edit") {
      await expect(this.page!).toHaveURL(/\/ui\/categories\/edit\/\d+/, {
        timeout: 5000,
      });
    }
  },
);

When(
  "I enter category name {string}",
  async function (this: CustomWorld, categoryName: string) {
    await this.page!.fill('input[name="name"]', categoryName);
  },
);

When(
  "I add a new category with {string}",
  async function (this: CustomWorld, categoryName: string) {
    const categories = await openCategories(this);
    const addButton = this.page!.locator('a:has-text("Add A Category")');
    await addButton.click();

    await expect(this.page!).toHaveURL(/\/ui\/categories\/add/, {
      timeout: 5000,
    });

    // Fill the form
    await this.page!.fill('input[name="name"]', categoryName);

    // Submit
    const saveButton = this.page!.locator('button:has-text("Save")');
    await saveButton.click();

    this.parameters["lastAddedCategory"] = categoryName;
  },
);

Then(
  "I should be redirected to category list page",
  async function (this: CustomWorld) {
    await expect(this.page!).toHaveURL(/\/ui\/categories/, { timeout: 5000 });
  },
);

When(
  "I click the edit button for category {string}",
  async function (this: CustomWorld, categoryName: string) {
    const row = await getCategoryRowByName(this, categoryName);
    expect(await row.count()).toBeGreaterThan(0);

    const editButton = row.locator('a[title="Edit"]').first();
    await editButton.click();
  },
);

When(
  "I edit category {string} to {string}",
  async function (this: CustomWorld, oldName: string, newName: string) {
    // Clear and fill new name
    await this.page!.fill('input[name="name"]', newName);

    // Submit
    const saveButton = this.page!.locator('button:has-text("Save")');
    await saveButton.click();

    // Wait for redirect
    await expect(this.page!).toHaveURL(/\/ui\/categories/, { timeout: 5000 });

    this.parameters["lastEditedCategory"] = newName;
  },
);

When(
  "I delete category {string}",
  async function (this: CustomWorld, categoryName: string) {
    // Find row with category name
    const row = await getCategoryRowByName(this, categoryName);
    expect(await row.count()).toBeGreaterThan(0);

    // Click delete button (inside the form)
    const deleteButton = row.locator('button[title="Delete"]').first();

    // Handle browser confirmation dialog and wait for navigation
    let deletePromise = this.page!.waitForNavigation({
      waitUntil: "networkidle",
    }).catch(() => {});

    this.page!.once("dialog", (dialog) => {
      dialog.accept();
    });

    await deleteButton.click();
    await deletePromise;

    // Wait a bit for the page to reload
    await this.page!.waitForTimeout(500);

    this.parameters["lastDeletedCategory"] = categoryName;
  },
);

When(
  "I search categories for {string}",
  async function (this: CustomWorld, searchTerm: string) {
    const categories = await openCategories(this);
    await categories.searchCategory(searchTerm);

    this.parameters["searchTerm"] = searchTerm;
  },
);

Then(
  "I should see the category {string} in the category list",
  async function (this: CustomWorld, categoryName: string) {
    const row = await getCategoryRowByName(this, categoryName);
    await expect(row.first()).toBeVisible({ timeout: 5000 });
  },
);

Then(
  "the category {string} should be visible in the category list",
  async function (this: CustomWorld, categoryName: string) {
    const row = await getCategoryRowByName(this, categoryName);
    await expect(row.first()).toBeVisible({ timeout: 5000 });
  },
);

Then(
  "I should not see the category {string} in the category list",
  async function (this: CustomWorld, categoryName: string) {
    const row = await getCategoryRowByName(this, categoryName);
    await expect(row).not.toBeVisible({ timeout: 5000 });
  },
);

Then(
  "I should see a category validation error",
  async function (this: CustomWorld) {
    // Check for error alert or toast message
    const errorAlert = this.page!.locator(".alert-danger");
    const errorToast = this.page!.locator(".toast-danger");

    const isErrorVisible =
      (await errorAlert.isVisible().catch(() => false)) ||
      (await errorToast.isVisible().catch(() => false));

    expect(isErrorVisible || this.page!.url().includes("/add")).toBeTruthy();
  },
);

Then(
  "only categories matching {string} should be shown",
  async function (this: CustomWorld, searchTerm: string) {
    const rows = this.page!.locator("tbody tr");
    const count = await rows.count();

    // Verify each visible row contains the search term
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      expect(text?.toUpperCase()).toContain(searchTerm.toUpperCase());
    }
  },
);

Then(
  "the categories list should be visible",
  async function (this: CustomWorld) {
    const categories = new CategoriesPage(this.page!);
    await categories.verifyTableVisible();
  },
);

Then(
  "the {string} button should not be visible",
  async function (this: CustomWorld, buttonText: string) {
    const button = this.page!.locator(`a:has-text("${buttonText}")`);
    await expect(button).not.toBeVisible();
  },
);

Then(
  "the edit button should not be visible for any category",
  async function (this: CustomWorld) {
    const editButtons = this.page!.locator('a[title="Edit"]');
    const count = await editButtons.count();

    // Check that all edit buttons are disabled
    for (let i = 0; i < count; i++) {
      const button = editButtons.nth(i);
      const isDisabled = await button.getAttribute("disabled");
      expect(isDisabled).not.toBeNull();
    }
  },
);

Then(
  "the delete button should not be visible for any category",
  async function (this: CustomWorld) {
    const deleteButtons = this.page!.locator('button[title="Delete"]');
    const count = await deleteButtons.count();

    // Check that all delete buttons are disabled
    for (let i = 0; i < count; i++) {
      const button = deleteButtons.nth(i);
      const isDisabled = await button.getAttribute("disabled");
      expect(isDisabled).not.toBeNull();
    }
  },
);

When(
  "I try to access the {string} page directly",
  async function (this: CustomWorld, pageType: string) {
    if (pageType.includes("Add")) {
      const addPage = new CategoryAddPage(this.page!);
      await addPage.navigateToAddCategory();
    } else if (pageType.includes("Edit")) {
      // Navigate to edit with a sample ID (user should not have access)
      const editPage = new CategoryEditPage(this.page!);
      await editPage.navigateToEditCategory(1);
    }
  },
);

Then(
  "I should be redirected to error page {string}",
  async function (this: CustomWorld, expectedUrl: string) {
    await expect(this.page!).toHaveURL(expectedUrl, { timeout: 5000 });
  },
);
