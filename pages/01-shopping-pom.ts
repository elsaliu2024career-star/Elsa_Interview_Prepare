import { Locator, Page } from "@playwright/test";

export interface ProductInfo {
  name: string;
  quantity: string;
  price: string;
}

export interface OderInfo{
    name: string
    country: string;
    city: string;
    card: string;
    month: string;
    year: string
};

export class ShoppingPOM {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async chooseProductByName(productInfo: ProductInfo) {
    await this.page.getByRole("link", { name: productInfo.name }).click();
  }

  async addCart() {
    // page.once("dialog", (dialog) => {
    //   console.log(`Dialog message: ${dialog.message()}`);
    //   dialog.dismiss().catch(() => {});
    // });
    // await page.getByRole("link", { name: "Add to cart" }).click();
    await Promise.all([
      this.page.getByRole("link", { name: "Add to cart" }).click(),
      this.page.waitForEvent("dialog").then((dialog) => {
        dialog.message().includes("Product added");
        dialog.accept();
      }),
    ]);
  }

  priceInfo(productInfo: ProductInfo): Locator {
    return this.page.getByRole("heading", {
      name: `${productInfo.price} *includes tax`,
    });
  }

  async placeOrder(): Promise<string> {
    await this.page.getByRole("link", { name: "Cart", exact: true }).click();
    await this.page.locator("#totalp").waitFor({ state: "visible" });
    const totalPrice = (await this.page.locator("#totalp").textContent()) ?? "";
    await this.page.getByRole("button", { name: "Place Order" }).click();

    return totalPrice;
  }

  async confirmOrderWithInfo(orderInfo: OderInfo) {

    await this.page.locator('#name').fill(orderInfo.name);
    await this.page.getByRole("textbox", { name: "Country:" }).fill(orderInfo.country);
    await this.page.getByRole("textbox", { name: "City:" }).fill(orderInfo.city);
    await this.page.getByRole("textbox", { name: "Credit card:" }).fill(orderInfo.card);
    await this.page.getByRole("textbox", { name: "Month:" }).fill(orderInfo.month);
    await this.page.getByRole("textbox", { name: "Year:" }).fill(orderInfo.year);

    await this.page.getByRole("button", { name: "Purchase" }).click();
  }

    successMessage(): Locator {
      return this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
    }
}
