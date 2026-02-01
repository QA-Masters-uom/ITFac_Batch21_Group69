import { BasePage } from './BasePage';
import { Page } from 'playwright';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Selectors
    private usernameInput = 'input[placeholder="Username"]'; // Adjusted based on standard patterns or inspection
    private passwordInput = 'input[placeholder="Password"]';
    private loginButton = 'button:has-text("Login")';

    async login(username: string, pass: string) {
        // Navigate if not already there
        if (!this.page.url().includes('/ui/login')) {
            await this.navigateTo('http://localhost:8081/ui/login');
        }

        // Fill credentials
        // Note: Adjust selectors if specific IDs are found, otherwise generic ones used
        // Based on previous inspection: inputs[0] and inputs[1] were used.
        // Let's use robust selectors if possible, or fallback
        await this.page.fill('input[type="text"]', username);
        await this.page.fill('input[type="password"]', pass);
        await this.page.click('button');
    }
}
