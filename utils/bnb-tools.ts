import { expect, Locator, Page } from "@playwright/test";


export class BnbTools{

    protected readonly page: Page;


    constructor(page:Page){
        this.page = page;
    }

    async navigateToURL(url: string){
        const response = await this.page.goto(url,{waitUntil : 'load'});
        expect(response?.ok()).toBeTruthy();
    }

    async navigateToURLWithStatusCheck(url: string, expectedStatus: number){
        const response = await this.page.goto(url,{waitUntil : 'load'});
        expect(response?.status()).toBe(expectedStatus);
    }

    async fillTheForm(locator: Locator,content: string){
        await locator.waitFor({state:"visible"});
        await locator.fill(content);
    }

    async getTextContent(locator: Locator):Promise<string>{
        await locator.waitFor({state:"visible"});
        return await locator.textContent() ?? "";
    }

    async safeClick(locator: Locator){
        await locator.waitFor({state:"visible"});
        await locator.click();
    }
}