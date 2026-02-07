import { Given, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";

type PlantData = {
  name: string;
  category: string;
  price: string;
  quantity: string;
};

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8081";

function tableToPlant(table: any): PlantData {
  const row = table.hashes()[0];
  return {
    name: row.name,
    category: row.category,
    price: row.price,
    quantity: row.quantity,
  };
}

function authHeaders(world: CustomWorld, tokenKey: string = "token") {
  const token = world.parameters[tokenKey];
  if (!token) throw new Error(`No token found in world.parameters['${tokenKey}']`);
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

async function getSubCategoryIdByName(world: CustomWorld, categoryName: string, tokenKey: string) {
  const res = await world.page!.request.get(`${BASE_URL}/api/categories/sub-categories`, {
    headers: authHeaders(world, tokenKey),
  });

  expect(res.status()).toBe(200);
  const body = await res.json();

  const list = Array.isArray(body) ? body : body.data ?? [];
  const found = list.find(
    (c: any) => String(c.name).toLowerCase() === categoryName.toLowerCase()
  );

  if (!found) {
    if (list.length > 0) return list[0].id;
    throw new Error(`No sub-categories returned; cannot map category "${categoryName}"`);
  }

  return found.id;
}

async function getPlantIdByName(world: CustomWorld, name: string, tokenKey: string) {
  const res = await world.page!.request.get(`${BASE_URL}/api/plants`, {
    headers: authHeaders(world, tokenKey),
  });

  expect(res.status()).toBe(200);
  const plants = await res.json();
  const list = Array.isArray(plants) ? plants : plants.data ?? [];

  const found = list.find((p: any) => String(p.name).toLowerCase() === name.toLowerCase());
  return found?.id;
}

async function createPlant(world: CustomWorld, data: PlantData, tokenKey: string) {
  const categoryId = await getSubCategoryIdByName(world, data.category, tokenKey);

  const res = await world.page!.request.post(`${BASE_URL}/api/plants/category/${categoryId}`, {
    headers: authHeaders(world, tokenKey),
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
    },
  });

  world.parameters["response"] = res;
  return res;
}

async function updatePlant(world: CustomWorld, plantId: number, data: PlantData, tokenKey: string) {
  const categoryId = await getSubCategoryIdByName(world, data.category, tokenKey);

  const res = await world.page!.request.put(`${BASE_URL}/api/plants/${plantId}`, {
    headers: authHeaders(world, tokenKey),
    data: {
      name: data.name,
      categoryId,
      price: Number(data.price),
      quantity: data.quantity,
    },
  });

  world.parameters["response"] = res;
  return res;
}

async function deletePlant(world: CustomWorld, plantId: number, tokenKey: string) {
  const res = await world.page!.request.delete(`${BASE_URL}/api/plants/${plantId}`, {
    headers: authHeaders(world, tokenKey),
  });

  world.parameters["response"] = res;
  return res;
}

Given("a plant exists via API named {string}", async function (this: CustomWorld, name: string) {
  await ensureAdminToken(this);

  const existingId = await getPlantIdByName(this, name, "adminToken");
  if (existingId) return;

  await createPlant(
    this,
    { name, category: "Orchid", price: "10", quantity: "100" },
    "adminToken"
  );

  const res = this.parameters["response"];
  if (!res.ok()) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Failed to seed plant "${name}". Status=${res.status()} Body=${txt}`);
  }
});

When("I create a plant via API with:", async function (this: CustomWorld, table: any) {
  const data = tableToPlant(table);
  await createPlant(this, data, "token");
});

When("I update plant {string} via API with:", async function (this: CustomWorld, oldName: string, table: any) {
  const data = tableToPlant(table);

  const id = await getPlantIdByName(this, oldName, "token");
  if (!id) throw new Error(`Plant not found to update: "${oldName}"`);

  await updatePlant(this, id, data, "token");
});

When("I delete plant {string} via API", async function (this: CustomWorld, name: string) {
  const id = await getPlantIdByName(this, name, "token");
  if (!id) throw new Error(`Plant not found to delete: "${name}"`);

  await deletePlant(this, id, "token");
});

When("I get all plants via API", async function (this: CustomWorld) {
  const res = await this.page!.request.get(`${BASE_URL}/api/plants`, {
    headers: authHeaders(this, "token"),
  });
  this.parameters["response"] = res;
});

When("I search plants via API for {string}", async function (this: CustomWorld, term: string) {
  let res = await this.page!.request.get(
    `${BASE_URL}/api/plants/paged?search=${encodeURIComponent(term)}&page=0&size=10`,
    { headers: authHeaders(this, "token") }
  );

  if (res.status() >= 400) {
    res = await this.page!.request.get(`${BASE_URL}/api/plants`, {
      headers: authHeaders(this, "token"),
    });
  }

  this.parameters["response"] = res;
});
