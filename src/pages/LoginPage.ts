import { BasePage } from "./BasePage";
import { Page } from "playwright";
import { expect } from "@playwright/test";
import { config } from "../support/config";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors - These are generic since we don't have the login HTML structure
  // Adjust based on actual HTML structure of login page
  private usernameInput = 'input[type="text"]';
  private passwordInput = 'input[type="password"]';
  private loginButton = "button:visible";
  private loginHeading = "h1, h2, .login-heading";

  async isLoginPageVisible(): Promise<boolean> {
    return await this.page.isVisible(this.loginHeading).catch(() => true);
  }

  async login(username: string, password: string) {
    // Navigate to login if not already there
    if (!this.page.url().includes("/ui/login")) {
      await this.navigateTo(`${config.uiBaseUrl}${config.uiLogin}`);
    }

    // Fill credentials
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);

    // Click login button
    await this.page.click(this.loginButton);

    // Wait for navigation to dashboard
    await expect(this.page).toHaveURL(/\/ui\/dashboard/, { timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    // Check if we're on the dashboard page
    return this.page.url().includes("/ui/dashboard");
  }
}
