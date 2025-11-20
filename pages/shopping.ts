import { expect, Locator, Page } from "@playwright/test";
import { CommonActions } from "../utils/common-actions";
import { timeLog } from "console";

export class ShoppingWorkFlow {
  protected readonly page: Page;
  protected readonly commonActions: CommonActions;
  protected readonly locatorMap: Record<string, any>;

  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);
    this.locatorMap = {
      heading: page.locator("#nava"),
      Samsung: {
        homepageLocator: page.getByRole("link", { name: "Samsung galaxy s6" }),
        productTitle: "Samsung galaxy s6",
        productHeading: page.locator("div#tbodyid h2:nth-child(1)"),
        priceLocator: page.locator('.price-container'),
        addToCartLocator: page.getByRole('link', { name: 'Add to cart' }),
      },
    };
  }

  async navigateToPage(url: string): Promise<number> {
    const response = await this.page.goto(url, { waitUntil: "load" });
    return response?.status() ?? 0;
  }

  async getTextContent(title: string) {
    await this.commonActions.getTextContent(this.locatorMap[title]);
  }

  async clickProduct(
    title: string
  ): Promise<{ productTitle?: string; price?: number }> {
    const response = await Promise.all([
      this.page.waitForResponse((res) => res.status() === 200),
      this.commonActions.safeClick(this.locatorMap[title]),
    ]);

    const productTitle = await this.commonActions.getTextContent(this.locatorMap[title]["productHeading"]);
    const price = Number(await this.commonActions.getTextContent(this.locatorMap[title]['priceLocator']));

    return {'productTitle': productTitle, 'price': price};
  }

  async addtoCart(itme: string){
    this.page.once(
        'dialog',
        (dialog) => {expect.soft(dialog.message).toContain('Product added'); dialog.accept()}      
    );

    await this.commonActions.safeClick(this.locatorMap[itme]['addToCartLocator']);
  }

//   async 

}
