import { Locator, Page } from "@playwright/test";

export interface ProductInfo {
  name: string;
  quantity: string;
}

export  interface OrderInfo {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
}

export class ShoppingTemplate {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async chooseProduct(productInfo: ProductInfo) {
    await this.page.getByRole("link", { name: productInfo.name }).click();
  }

  pricePerProduct(): Locator {
    return this.page.locator(".price-container");
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

  async placeOrder(orderInfo: OrderInfo) {
    await this.page.getByRole("button", { name: "Place Order" }).click();

    await this.page.locator('#name').fill(orderInfo.name);

    await this.page.getByRole("textbox", { name: "Country:" }).fill(orderInfo.country);

    await this.page.getByRole("textbox", { name: "City:" }).fill(orderInfo.city);

    await this.page.getByRole("textbox", { name: "Credit card:" }).fill(orderInfo.card);

    await this.page.getByRole("textbox", { name: "Month:" }).fill(orderInfo.month);

    await this.page.getByRole("textbox", { name: "Year:" }).fill(orderInfo.year);

    await this.page.getByRole("button", { name: "Purchase" }).click();
  }

  totalPrice(): Locator {
    return this.page.locator("#totalp");
  }

  successMessage(): Locator {
    return this.page.getByRole('heading', { name: 'Thank you for your purchase!' });
  }

}
