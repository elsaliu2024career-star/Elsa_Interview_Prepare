import { Locator, Page } from "@playwright/test";
import { CommonActions } from "../utils/common-actions";


export class ProductDetail {
    protected readonly page: Page;
    protected readonly locatorMap: Record<string, Locator>;
    protected readonly commonActions: CommonActions;

    constructor(page:Page){
        this.page = page;
        this.locatorMap = {
            addCart: page.getByRole('link', { name: 'Add to cart' })
        };
        this.commonActions = new CommonActions(page);
    }

    async navigateToProductDetailPage(url:string): Promise<number>{
        const statusCode = await this.commonActions.navigateToPage(url);
        return statusCode;
    }

    async addProductToCart(){

        await Promise.all([
            this.page.waitForEvent('dialog').then(dialog=> {
                dialog.message().includes('Product added');
                dialog.accept();
            }),
            this.commonActions.safeClick(this.locatorMap['addCart'])
        ]);

        // this.page.once(
        //     'dialog',
        //     (dialog) => {
        //         dialog.message().includes('Product added');
        //         dialog.accept()
        //     }
        // );

        // await this.commonActions.safeClick(this.locatorMap['addCart']);
    }
    
}