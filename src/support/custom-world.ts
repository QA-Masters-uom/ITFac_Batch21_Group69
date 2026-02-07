import {
  setWorldConstructor,
  World,
  IWorldOptions,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright";
import * as playwright from "playwright";

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  parameters: Record<string, any>;
  isUITest?: boolean;
}

setDefaultTimeout(1200000);

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  parameters: Record<string, any> = {};
  isUITest?: boolean;

  constructor(options: IWorldOptions) {
    super(options);
    // Detect if this is a UI test by checking tags
    const tags = (options as any).pickle?.tags?.map((t: any) => t.name) || [];
    this.isUITest = tags.includes("@UI");
  }

  async init() {
    // For UI tests, launch visible browser; for API tests, launch headless
    const headless = !this.isUITest;
    this.browser = await playwright.chromium.launch({ headless });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close() {
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
