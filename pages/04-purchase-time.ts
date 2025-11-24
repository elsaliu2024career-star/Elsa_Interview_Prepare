import { Locator, Page } from "@playwright/test";

export interface ProductInfo {
  name: string;
  quantity: string;
}

export interface UserInfo{
    Name: string;
    Country: string;
    City: string;
    Card: string;
    Month: string;
    Year: string;
}

export class PurchaseTime {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async chooseProductAndAddToCart(productInfo: ProductInfo) {

    await Promise.all([
        this.page.getByRole("link", { name: productInfo.name }).click(),
        this.page.waitForResponse((res)=>res.ok() && res.url().includes('prod'))
    ]);
    // await this.page.getByRole("link", { name: productInfo.name }).click();
    // await expect(
    //   page.getByRole("heading", { name: "$820 *includes tax" })
    // ).toBeVisible();

    for (let i = 0; i < Number(productInfo.quantity); i++) {
      await Promise.all([
        this.page.getByRole("link", { name: "Add to cart" }).click(),
        this.page.waitForEvent("dialog").then((dialog) => {
          dialog.message().includes("Product added");
          dialog.dismiss().catch(() => {});
        }),
      ]);
    }

  }

  pricePerProduct(): Locator {
    return this.page.locator(".price-container");
  }

  totalPrice(): Locator {
    return this.page.locator("#totalp");
  }

  async gotoCartPlaceOrder(userInfo: UserInfo) {
    await this.page.getByRole("button", { name: "Place Order" }).click();

    await this.page.locator('#name').fill(userInfo.Name);

    await this.page.getByRole("textbox", { name: "Country:" }).fill(userInfo.Country);

    await this.page.getByRole("textbox", { name: "City:" }).fill(userInfo.City);

    await this.page.getByRole("textbox", { name: "Credit card:" }).fill(userInfo.Card);

    await this.page.getByRole("textbox", { name: "Month:" }).fill(userInfo.Month);

    await this.page.getByRole("textbox", { name: "Year:" }).fill(userInfo.Year);

    await this.page.getByRole("button", { name: "Purchase" }).click();
  }

  successMessage():Locator{
    return this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
  }

}
