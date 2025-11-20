import { expect, Locator, Page } from "@playwright/test";



export class QuickTools{

    protected readonly page:Page;
    constructor(page:Page){
        this.page = page;
    }

    async navigateToURL(url: string){
        const response = await this.page.goto(url, {waitUntil: 'load'});
        expect(response?.ok()).toBeTruthy;
    }

    async getText(locator:Locator):Promise<string>{
        await locator.waitFor({state: 'visible'});
        return await locator.textContent() ?? '';
    }

    async safeClick(locator:Locator){
        await locator.waitFor({state:'visible'});
        await locator.click();
    }

    async getClickStatusCode(locator: Locator):Promise<number>{
        const [response] =  await Promise.all([
            this.page.waitForResponse((res)=> res.url().includes('reservation')),
            this.safeClick(locator),
        ]);

        return response?.status() ?? 0;

    }

    async fillText(locator: Locator, text: any){
        await locator.waitFor({state: 'visible'});
        await locator.fill(text);
    }
}