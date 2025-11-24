import { Locator, Page } from "@playwright/test";

export interface UserCredential {
  email: string;
  password: string;
}

export interface CustomerCredential {
  email: string;
  password: string;
}

export interface MemberInfo {
  firstname: string;
  lastname: string;
  postcode: string;
}

export class Ecommerce {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async logginWithCredential(userCredential: UserCredential) {
    await this.page
      .getByRole("textbox", { name: "Email*" })
      .fill(userCredential.email);
    await this.page
      .getByRole("textbox", { name: "Password*" })
      .fill(userCredential.password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }

  loginSuccess(): Locator {
    return this.page.getByRole("heading", { name: "Login Successful" });
  }

  async gotoShoppingPage(customerCredential: CustomerCredential) {
    await this.page.getByText("E-Commerce Site").click();

    await Promise.all([
      this.page.getByRole("link", { name: "Visit Demo Site" }).click(),
      this.page.waitForResponse(
        (res) => res.url().includes("ecommerce/login") && res.ok()
      ),
    ]);

    await this.page
      .getByRole("textbox", { name: "Email*" })
      .fill(customerCredential.email);
    await this.page
      .getByRole("textbox", { name: "Password*" })
      .fill(customerCredential.password);

    await Promise.all([
      this.page.getByRole("button", { name: "Login" }).click(),
      this.page.waitForResponse(
        (res) =>
          res.url().includes("practice.qabrains.com/ecommerce") && res.ok()
      ),
    ]);
  }

  async addProductList(productList: number[]) {
    for (let i = 0; i < productList.length; i++) {
      await this.page
        .getByRole("button", { name: "Add to cart" })
        .nth(i)
        .click();
    }
  }

  async checkoutwithInfo(memberInfo: MemberInfo) {
    await this.page.getByRole("button", { name: "2" }).click();
    await this.page.getByRole("button", { name: "Checkout" }).click();

    await this.page
      .getByRole("textbox", { name: "Ex. John" })
      .fill(memberInfo.firstname);

    await this.page
      .getByRole("textbox", { name: "Ex. Doe" })
      .fill(memberInfo.lastname);

    await this.page.getByRole("textbox").nth(3).fill(memberInfo.postcode);
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  totalPrice(): Locator {
    return this.page.locator(".text-md:nth-child(4)");
  }

  async finishShopping() {
    await this.page.getByRole("button", { name: "Finish" }).click();
  }

  thanksForOrder(): Locator {
    return this.page.getByRole("heading", {
      name: "Thank you for your order!",
    });
  }

  usernameIncorrect(): Locator {
    return this.page.getByText("Username is incorrect.");
  }
}
