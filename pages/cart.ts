import { Locator, Page } from "@playwright/test";
import { CommonActions } from "../utils/common-actions";


export class Cart{

    protected readonly page: Page;
    protected readonly commonActions: CommonActions;
    protected readonly locatorMap: Record<string, Locator>;
    protected readonly orderLocatorMap: Record<string, Locator>;

    constructor(page:Page){
        this.page = page;
        this.commonActions = new CommonActions(page);
        this.locatorMap = {
            totalPrice: page.locator('#totalp'),
            placeHolder: page.getByRole('button', { name: 'Place Order' }),
            purchase: page.getByRole('button', { name: 'Purchase' }),
            successMessage: page.locator('h2:nth-child(6)'),
        };
        this.orderLocatorMap =  {
                Name: page.locator('input#name'),
                Country: page.locator('input#country'),
                City: page.locator('input#city'),
                Card: page.locator('input#card'),
                Month: page.locator('input#month'),
                Year: page.locator('input#year'),
            }
    }

    async naviagateToPage(url:string): Promise<number>{
        const statusCode = await this.commonActions.navigateToPage(url);
        return statusCode;
    }

    async getContent(name:string):Promise<string>{
        await this.verifyLocatorName(name);
        return this.commonActions.getTextContent(this.locatorMap[name]);
    }

    async placeOrder(){
        await this.commonActions.safeClick(this.locatorMap['placeHolder']);
    }

    async fillOrder(orderDetails: {Name: string,Country:string,City: string,Card:string,Month:string,Year:string}){
        for(const [item, locator] of Object.entries(this.orderLocatorMap)){
            await locator.fill(orderDetails[item as keyof typeof orderDetails]);
        };

        await this.commonActions.safeClick(this.locatorMap['purchase']);

    };
    
    async verifyLocatorName(name:string){
        if(!this.locatorMap[name]){
            throw new Error(`Locator for ${name} not found`);
        }
    }

}