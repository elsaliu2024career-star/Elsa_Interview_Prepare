import { Page } from "@playwright/test";

export interface ProductInfo{
    productName: string;
    productPrice: string;
    productNumer: string;
};

export interface UserInfo{
    name: string;
    country: string;
    city: string;
    card: string;
    month: string
    year: string;
};


export class TemuPage{
    protected readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async checkDetail(productInfo: ProductInfo){
        await this.page.getByRole('link', { name: productInfo.productName }).click();
    }

    async addToCart(productInfo: ProductInfo){
        for(let i =0; i< Number(productInfo.productNumer); i++){
                    await Promise.all([
            this.page.waitForEvent('dialog').then(dialog=> {
                dialog.message().includes('Product added');
                dialog.accept();
            }),
            this.page.getByRole('link', { name: 'Add to cart' }).click(),
        ]);
        };
    }

    async verifyTotalPriceAndPlaceOrder(): Promise<string>{
        await this.page.goto('https://www.demoblaze.com/cart.html',{waitUntil : 'load'});
        await this.page.locator('#totalp').waitFor({state: 'visible'});
        const totalPrice = (await this.page.locator('#totalp').textContent()) ?? '';
        await this.page.getByRole('button', { name: 'Place Order' }).click();
        return totalPrice;
    }

        async checkoutDirectly(){
        await this.page.goto('https://www.demoblaze.com/cart.html',{waitUntil : 'load'});
        // await this.page.locator('#totalp').waitFor({state: 'visible'});
        // const totalPrice = (await this.page.locator('#totalp').textContent()) ?? '';
        await this.page.getByRole('button', { name: 'Place Order' }).click();
        // return totalPrice;
    }

    async fillUserInfoAndPurchase(userInfo: UserInfo){
        for(const [item, text] of Object.entries(userInfo)){
            await this.page.locator(`#${item}`).fill(text);
        };

        await this.page.getByRole('button', { name: 'Purchase' }).click();
    }

    async isSuccessMessageVisible(): Promise<boolean>{
        return await this.page.getByRole('heading', { name: 'Thank you for your purchase!' }).isVisible();
    }


}