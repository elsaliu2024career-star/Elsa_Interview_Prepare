import { expect, Locator, Page } from "@playwright/test";
import test from "node:test";

export class QuickPOM{

    protected readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async safeClick(locator:Locator){
        await locator.click();
    }

    async fillText(locator: Locator, text: string){
        await locator.fill(text);
    }

    async clickNavigation(locator: Locator){
        const [response] = await Promise.all([
            this.page.waitForResponse((res)=> res.url().includes('reservation')),
            this.safeClick(locator),
        ]);

        expect.soft(response?.ok).toBeTruthy();
    }

    async getText(locator:Locator):Promise<string>{
        return (await locator.textContent()) ?? ''; 
    }




}