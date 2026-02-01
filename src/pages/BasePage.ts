import { Page } from 'playwright';

export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async getTitle() {
        return await this.page.title();
    }
}
