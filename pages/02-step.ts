import { Locator, Page } from "@playwright/test";

export interface ProductInfo {
  name: string;
  quantity: string;
}

export interface OrderInfo {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class StepTest {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async chooseProduct(productInfo: ProductInfo) {
    await Promise.all([
      this.page.getByRole("link", { name: productInfo.name }).click(),
      this.page.waitForResponse((res) => res.ok()),
    ]);
  }

  async addToCartWithQuantityTimes(productInfo: ProductInfo) {
    for (let i = 0; i < Number(productInfo.quantity); i++) {
      await Promise.all([
        this.page.getByRole("link", { name: "Add to cart" }).click(),
        this.page.waitForEvent("dialog").then((dialog) => {
          dialog.message().includes("Product added");
          dialog.accept();
        }),
      ]);
    }
  }

  async getPricePerProduct(): Promise<string> {
    await this.page.locator(".price-container").waitFor({ state: "visible" });
    const priceText = (await this.page.locator(".price-container").textContent())?.replace(/[^\d.]/g, '') ?? "";
    console.log(priceText);
    return priceText;
  }

  async gotoCartAndPlaceOrder(): Promise<string> {
    await Promise.all([
      this.page.getByRole("link", { name: "Cart", exact: true }).click(),
      this.page.waitForResponse(
        (res) => res.ok() && res.url().includes("cart")
      ),
    ]);
    await this.page.locator("#totalp").waitFor({ state: "visible" });
    const totalPrice = (await this.page.locator("#totalp").textContent()) ?? "";
    await this.page.getByRole("button", { name: "Place Order" }).click();

    return totalPrice;
  }

  async placeOrderWithInfo(orderInfo: OrderInfo) {
    await this.page.locator('#name').fill(orderInfo.name);
    await this.page.getByRole("textbox", { name: "Country:" }).fill(orderInfo.country);
    await this.page.getByRole("textbox", { name: "City:" }).fill(orderInfo.city);
    await this.page.getByRole("textbox", { name: "Credit card:" }).fill(orderInfo.card);
    await this.page.getByRole("textbox", { name: "Month:" }).fill(orderInfo.month);
    await this.page.getByRole("textbox", { name: "Year:" }).fill(orderInfo.year);

    await this.page.getByRole("button", { name: "Purchase" }).click();
  }

  successMessage():Locator{
    return this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
  }

}
