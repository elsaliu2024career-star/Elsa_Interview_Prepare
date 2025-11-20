import { Locator, Page } from "@playwright/test";
import { CommonActions } from "../utils/common-actions";


export class HomePage {
    protected readonly page: Page;
    protected readonly locatorMap: Record<string, Locator>;
    protected readonly commonActions: CommonActions;

    constructor(page:Page){
        this.page =page;
        this.commonActions = new CommonActions(page);
        this.locatorMap = {
            heading: page.locator('#nava'),
            samsungLink: page.locator('.col-lg-4:nth-child(1) .hrefch'),
            samsungPrice: page.locator('.col-lg-4:nth-child(1) h5'),
        };
    }

    async navigateToHomePage(url:string): Promise<number>{
        const response = await this.page.goto(url, {waitUntil : 'load'});
        return response?.status() ?? 0;
    }

    async getProductDetails(name:string):Promise<string>{
        await this.verifyLocatorName(name);
        return (await this.locatorMap[name].textContent()) ?? '';
    }

    async clickProductLink(name:string):Promise<number>{
        await this.verifyLocatorName(name);
        const response =  await Promise.all([this.page.waitForResponse((res) => res.url().includes('idp_=1')), this.commonActions.safeClick(this.locatorMap[name])]);
        return response[0].status();
    }

    async verifyLocatorName(name:string){
        if(!this.locatorMap[name]){
            throw new Error(`Locator for ${name} not found`);
        }
    }

}