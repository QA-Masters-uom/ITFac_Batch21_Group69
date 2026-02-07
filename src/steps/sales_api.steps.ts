import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8081";

// ============ TYPES ============

interface SaleData {
  id: number;
  plant: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  quantity: number;
  totalPrice: number;
  soldAt: string;
}

interface PageResponse {
  content: SaleData[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  empty: boolean;
}

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

async function findPlantByName(
  world: CustomWorld,
  plantName: string,
  tokenKey: string,
) {
  const res = await world.page!.request.get(`${BASE_URL}/api/plants`, {
    headers: authHeaders(world, tokenKey),
  });

  expect(res.status()).toBe(200);
  const plants = await res.json();
  const list = Array.isArray(plants) ? plants : (plants.data ?? []);

  const found = list.find(
    (p: any) => String(p.name).toLowerCase() === plantName.toLowerCase(),
  );
  if (!found) {
    throw new Error(
      `Plant "${plantName}" not found in database. Available plants: ${list.map((p: any) => p.name).join(", ")}`,
    );
  }
  return found;
}

async function getSalesAll(world: CustomWorld, tokenKey: string) {
  const res = await world.page!.request.get(`${BASE_URL}/api/sales`, {
    headers: authHeaders(world, tokenKey),
  });

  world.parameters["response"] = res;
  return res;
}

async function getSalesPaged(
  world: CustomWorld,
  page: number,
  size: number,
  tokenKey: string,
) {
  const res = await world.page!.request.get(
    `${BASE_URL}/api/sales/page?page=${page}&size=${size}`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function sellPlant(
  world: CustomWorld,
  plantId: number,
  quantity: number,
  tokenKey: string,
) {
  const res = await world.page!.request.post(
    `${BASE_URL}/api/sales/plant/${plantId}?quantity=${quantity}`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function deleteSale(
  world: CustomWorld,
  saleId: number,
  tokenKey: string,
) {
  const res = await world.page!.request.delete(
    `${BASE_URL}/api/sales/${saleId}`,
    {
      headers: authHeaders(world, tokenKey),
    },
  );

  world.parameters["response"] = res;
  return res;
}

async function getOrCreateSale(world: CustomWorld, plantName: string) {
  await ensureAdminToken(world);

  // Get existing sales
  const salesRes = await world.page!.request.get(`${BASE_URL}/api/sales`, {
    headers: authHeaders(world, "adminToken"),
  });

  if (salesRes.ok()) {
    const sales = await salesRes.json();
    const salesList = Array.isArray(sales) ? sales : (sales.data ?? []);

    // If we have existing sales, use the first one
    if (salesList.length > 0) {
      const existingSale = salesList[0];
      world.parameters["saleId"] = existingSale.id;
      return existingSale;
    }
  }

  // No sales exist, create one
  const plant = await findPlantByName(world, plantName, "adminToken");
  const sellRes = await sellPlant(world, plant.id, 5, "adminToken");

  if (!sellRes.ok()) {
    const txt = await sellRes.text().catch(() => "");
    throw new Error(
      `Failed to create sale from plant "${plantName}". Status=${sellRes.status()} Body=${txt}`,
    );
  }

  const sale = await sellRes.json();
  world.parameters["saleId"] = sale.id;
  return sale;
}

// ============ GIVEN STEPS ============

Given(
  "the plant {string} exists via API",
  async function (this: CustomWorld, plantName: string) {
    await ensureAdminToken(this);
    const plant = await findPlantByName(this, plantName, "adminToken");
    this.parameters[`plant_${plantName}`] = plant;
  },
);

Given(
  "a sale exists via API from {string}",
  async function (this: CustomWorld, plantName: string) {
    await getOrCreateSale(this, plantName);
  },
);

Given(
  "multiple sales exist via API with count {int}",
  async function (this: CustomWorld, count: number) {
    await ensureAdminToken(this);

    const salesRes = await this.page!.request.get(`${BASE_URL}/api/sales`, {
      headers: authHeaders(this, "adminToken"),
    });

    const sales = await salesRes.json();
    const salesList = Array.isArray(sales) ? sales : (sales.data ?? []);

    // Check if we already have enough sales
    if (salesList.length >= count) {
      return;
    }

    // Create missing sales
    const plantsRes = await this.page!.request.get(`${BASE_URL}/api/plants`, {
      headers: authHeaders(this, "adminToken"),
    });

    const plants = await plantsRes.json();
    const plantsList = Array.isArray(plants) ? plants : (plants.data ?? []);

    if (plantsList.length === 0) {
      throw new Error("No plants available to create sales");
    }

    const rosePlant = plantsList.find(
      (p: any) => p.name.toUpperCase() === "S_ROSE",
    );
    if (!rosePlant) {
      throw new Error("S_ROSE plant not found");
    }

    const neededCount = count - salesList.length;
    const promises: Promise<void>[] = [];
    for (let i = 0; i < neededCount; i++) {
      const res = sellPlant(
        this,
        rosePlant.id,
        Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
        "adminToken",
      );

      promises.push(
        res
          .then(() => {})
          .catch((err) => {
            console.error(
              `Failed to create sale ${i + 1}/${neededCount}:`,
              err,
            );
          }),
      );
    }

    await Promise.all(promises);
  },
);

// ============ WHEN STEPS ============

When("I retrieve all sales via API", async function (this: CustomWorld) {
  await getSalesAll(this, "token");
});

When(
  "I sell plant {string} with quantity {int} via API",
  async function (this: CustomWorld, plantName: string, quantity: number) {
    const plant = this.parameters[`plant_${plantName}`];
    if (!plant)
      throw new Error(`No plant found with name '${plantName}' in parameters`);

    await sellPlant(this, plant.id, quantity, "token");
  },
);

When("I delete the sale via API", async function (this: CustomWorld) {
  const saleId = this.parameters["saleId"];
  if (!saleId) throw new Error("No saleId found in parameters");

  await deleteSale(this, saleId, "token");
});

When(
  "I delete a non-existent sale with ID {int} via API",
  async function (this: CustomWorld, saleId: number) {
    await deleteSale(this, saleId, "token");
  },
);

When(
  "I retrieve sales with page {int} and size {int} via API",
  async function (this: CustomWorld, page: number, size: number) {
    await getSalesPaged(this, page, size, "token");
  },
);

// ============ THEN STEPS ============

Then(
  "the sale response should contain valid sale details",
  async function (this: CustomWorld) {
    const response = this.parameters["response"];
    expect(response.status()).toBe(201);

    const sale = (await response.json()) as SaleData;

    expect(sale).toBeDefined();
    expect(sale.id).toBeDefined();
    expect(sale.plant).toBeDefined();
    expect(sale.plant.id).toBeDefined();
    expect(sale.quantity).toBeGreaterThan(0);
    expect(sale.totalPrice).toBeGreaterThan(0);
    expect(sale.soldAt).toBeDefined();

    // Verify totalPrice calculation
    const expectedTotal = sale.plant.price * sale.quantity;
    expect(sale.totalPrice).toBe(expectedTotal);

    this.parameters["saleId"] = sale.id;
  },
);

Then(
  "the paginated response should contain {int} sales",
  async function (this: CustomWorld, expectedCount: number) {
    const response = this.parameters["response"];
    expect(response.status()).toBe(200);

    const body = (await response.json()) as PageResponse;

    expect(body.content).toBeDefined();
    expect(body.content.length).toBe(expectedCount);
  },
);

Then(
  "pagination metadata should show total pages greater than {int}",
  async function (this: CustomWorld, minPages: number) {
    const response = this.parameters["response"];
    expect(response.status()).toBe(200);

    const body = (await response.json()) as PageResponse;

    expect(body.totalPages).toBeGreaterThan(minPages);
    expect(body.totalElements).toBeDefined();
    expect(body.number).toBeDefined();
    expect(body.size).toBeDefined();
  },
);

Given(
  "Out of stock plant {string} exists via API",
  async function (this: CustomWorld, plantName: string) {
    await ensureAdminToken(this);
    const plant = await findPlantByName(this, plantName, "adminToken");
    this.parameters[`plant_${plantName}`] = plant;
  },
);

// ============ DELETE ALL SALES HELPER ============

Given("all sales are deleted via API", async function (this: CustomWorld) {
  await ensureAdminToken(this);

  // Get all sales
  const salesRes = await this.page!.request.get(`${BASE_URL}/api/sales`, {
    headers: authHeaders(this, "adminToken"),
  });

  if (!salesRes.ok()) {
    return; // No sales to delete
  }

  const sales = await salesRes.json();
  const salesList = Array.isArray(sales) ? sales : (sales.data ?? []);

  const promises: Promise<any>[] = [];
  // Delete each sale
  for (const sale of salesList) {
    const d = deleteSale(this, sale.id, "adminToken");
    promises.push(d);
  }

  await Promise.all(promises);
});
