import { Locator, Page } from "@playwright/test";

export class CommonActions{

    protected readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async navigateToPage(url:string):Promise<number>{
        const response = await this.page.goto(url, {waitUntil : 'load'});
        return response?.status() ?? 0;    
    }

    async safeClick(locator: Locator){
        await locator.waitFor({state:"visible"});
        await locator.click();
    }

    async getTextContent(locator: Locator):Promise<string>{
        await locator.waitFor({state:"visible"});
        return await locator.textContent() ?? "";
    }
}