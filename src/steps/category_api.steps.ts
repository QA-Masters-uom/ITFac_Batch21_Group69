import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { config } from "../support/config";

const BASE_URL = config.apiBaseUrl;

// ============ TYPES ============

interface CategoryAPIData {
  id: number;
  name: string;
  parentName: string;
}

// ============ HELPER FUNCTIONS ============

function authHeaders(world: CustomWorld, tokenKey: string = "token") {
  const token = world.parameters[tokenKey];
  if (!token)
    throw new Error(`No token found in world.parameters['${tokenKey}']`);
  return { Authorization: `Bearer ${token}` };
}

async function loginAndGetToken(world: CustomWorld, role: "admin" | "normal") {
  const username = role === "admin" ? "admin" : "user";
  const password = role === "admin" ? "admin123" : "user123";

  const res = await world.page!.request.post(`${BASE_URL}/api/auth/login`, {
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
  tokenKey: string,
): Promise<CategoryAPIData | null> {
  const res = await world.page!.request.get(`${BASE_URL}/api/categories`, {
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

async function createCategory(
  world: CustomWorld,
  categoryName: string,
  tokenKey: string,
  parentId?: number,
) {
  const res = await world.page!.request.post(`${BASE_URL}/api/categories`, {
    headers: authHeaders(world, tokenKey),
    data: parentId ? { name: categoryName, parentId } : { name: categoryName },
  });

  world.parameters["response"] = res;
  return res;
}

async function updateCategory(
  world: CustomWorld,
  categoryId: number,
  categoryName: string | undefined,
  tokenKey: string,
) {
  const res = await world.page!.request.put(
    `${BASE_URL}/api/categories/${categoryId}`,
    {
      headers: authHeaders(world, tokenKey),
      data: categoryName !== "undefined" ? { name: categoryName } : {},
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function deleteCategory(
  world: CustomWorld,
  categoryId: number,
  tokenKey: string,
) {
  const res = await world.page!.request.delete(
    `${BASE_URL}/api/categories/${categoryId}`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function getOrCreateMainCategory(
  world: CustomWorld,
  tokenKey: string,
): Promise<CategoryAPIData> {
  const res = await world.page!.request.get(`${BASE_URL}/api/categories`, {
    headers: authHeaders(world, tokenKey),
  });

  expect(res.status()).toBe(200);
  const categories = await res.json();
  const list = Array.isArray(categories) ? categories : (categories.data ?? []);

  const found = list.find(
    (c: any) => String(c.name).toLowerCase() === "main" && c.parentName === "-",
  );

  if (found) {
    return found;
  }

  const createRes = await createCategory(world, "Main", tokenKey);
  expect(createRes.ok()).toBeTruthy();
  const createdCategory = await createRes.json();
  return createdCategory;
}

async function getAllCategories(world: CustomWorld, tokenKey: string) {
  const res = await world.page!.request.get(`${BASE_URL}/api/categories`, {
    headers: authHeaders(world, tokenKey),
  });

  world.parameters["response"] = res;
  return res;
}

async function searchCategories(
  world: CustomWorld,
  searchTerm: string,
  tokenKey: string,
) {
  const res = await world.page!.request.get(
    `${BASE_URL}/api/categories/page?search=${encodeURIComponent(searchTerm)}&page=0&size=10`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

// ============ GIVEN STEPS ============

Given(
  "a category exists via API named {string}",
  async function (this: CustomWorld, categoryName: string) {
    await ensureAdminToken(this);

    // Try to find existing category
    let category = await findCategoryByName(this, categoryName, "adminToken");

    // If not found, create it
    if (!category) {
      const res = await createCategory(this, categoryName, "adminToken");

      expect(res.ok()).toBeTruthy();
      category = await res.json();
    }

    this.parameters[`category_${categoryName}`] = category;
  },
);

Given(
  "a sub category exists via API named {string}",
  async function (this: CustomWorld, categoryName: string) {
    await ensureAdminToken(this);

    const subCategory = await findCategoryByName(
      this,
      categoryName,
      "adminToken",
    );

    if (subCategory) {
      const isSubCategory =
        subCategory.parentName && subCategory.parentName !== "-";
      if (isSubCategory) {
        // Case 1: It IS already a sub-category - keep it
        this.parameters[`category_${categoryName}`] = subCategory;
        return;
      } else {
        // Case 2: It IS a main category - delete it and create a sub-category instead
        await deleteCategory(this, subCategory.id, "adminToken");

        const mainCategory = await getOrCreateMainCategory(this, "adminToken");

        const res = await createCategory(
          this,
          categoryName,
          "adminToken",
          mainCategory.id,
        );

        expect(res.ok()).toBeTruthy();
        const createdSubCategory = await res.json();
        this.parameters[`category_${categoryName}`] = createdSubCategory;
        return;
      }
    } else {
      // Case 3: Category doesn't exist - create it as a sub-category
      const mainCategory = await getOrCreateMainCategory(this, "adminToken");

      const res = await createCategory(
        this,
        categoryName,
        "adminToken",
        mainCategory.id,
      );

      expect(res.ok()).toBeTruthy();
      const createdSubCategory = await res.json();
      this.parameters[`category_${categoryName}`] = createdSubCategory;
      return;
    }
  },
);

Given(
  "no category exists via API named {string}",
  async function (this: CustomWorld, categoryName: string) {
    await ensureAdminToken(this);

    // Try to find existing category
    const category = await findCategoryByName(this, categoryName, "adminToken");

    // If found, delete it
    if (category) {
      await deleteCategory(this, category.id, "adminToken");
    }
  },
);

// ============ WHEN STEPS ============

When(
  "I create a category via API with name {string}",
  async function (this: CustomWorld, categoryName: string) {
    await createCategory(this, categoryName, "token");
  },
);

When(
  "I update category {string} via API with name {string}",
  async function (this: CustomWorld, categoryName: string, newName: string) {
    const category = this.parameters[`category_${categoryName}`];
    if (!category) {
      throw new Error(
        `Category '${categoryName}' not found in world.parameters`,
      );
    }

    await updateCategory(this, category.id, newName, "token");
  },
);

When(
  "I delete category {string} via API",
  async function (this: CustomWorld, categoryName: string) {
    const category = this.parameters[`category_${categoryName}`];
    if (!category) {
      throw new Error(
        `Category '${categoryName}' not found in world.parameters`,
      );
    }

    await deleteCategory(this, category.id, "token");
  },
);

When("I get all categories via API", async function (this: CustomWorld) {
  await getAllCategories(this, "token");
});

When(
  "I search categories via API for {string}",
  async function (this: CustomWorld, searchTerm: string) {
    await searchCategories(this, searchTerm, "token");
  },
);

// ============ THEN STEPS ============

Then(
  "the response error should be {string}",
  async function (this: CustomWorld, expectedError: string) {
    const response = this.parameters["response"];
    expect(response).toBeDefined();
    expect([400, 403, 404, 409]).toContain(response.status());

    const body = await response.json();
    expect(body.error).toBe(expectedError);
  },
);

Then(
  "the response should contain categories start with {string}",
  async function (this: CustomWorld, prefix: string) {
    const response = this.parameters["response"];
    expect(response).toBeDefined();

    const body = await response.json();
    const categories =
      body.content || body.data || (Array.isArray(body) ? body : []);

    expect(Array.isArray(categories)).toBeTruthy();
    expect(categories.length).toBeGreaterThan(0);

    const matchingCategories = categories.filter((c: any) =>
      String(c.name).toUpperCase().startsWith(prefix.toUpperCase()),
    );

    expect(matchingCategories.length).toBeGreaterThan(0);
  },
);
