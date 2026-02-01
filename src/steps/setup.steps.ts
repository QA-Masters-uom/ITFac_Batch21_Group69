import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/custom-world';
import { LoginPage } from '../pages/LoginPage';
import { expect } from '@playwright/test';

Given('I am logged in as {string}', async function (this: CustomWorld, role: string) {
    const loginPage = new LoginPage(this.page!);

    let username = 'testuser';
    let password = 'test123';

    if (role === 'admin') {
        username = 'admin';
        password = 'admin123';
    }

    await loginPage.login(username, password);

    // Verify login success implicitly or explicitly
    // Dashboard URL check
    await expect(this.page!).toHaveURL(/\/ui\/dashboard/);
});

Given('I have a valid {string} token', async function (this: CustomWorld, role: string) {
    // For API tests, we might need to fetch a token via API request context
    // Playwright provides request context
    const username = role === 'admin' ? 'admin' : 'testuser';
    const password = role === 'admin' ? 'admin123' : 'test123';

    const response = await this.page!.request.post('http://localhost:8081/api/auth/login', {
        data: { username, password }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    this.parameters['token'] = body.token; // Store token in world parameters
});
