import { expect, Locator, Page } from "@playwright/test";


export class SimpleBnbPage{

    protected readonly page: Page

    constructor(page:Page){
        this.page = page;
    }

    async clickNavigation(locator: Locator){
        const [response] = await Promise.all([
            this.page.waitForResponse((res)=> res.url().includes('reservation')),
            locator.click(),
        ]);

        expect.soft(response?.ok()).toBeTruthy();
    }



}