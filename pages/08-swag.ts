import { Locator, Page } from "@playwright/test";

//data interface
export interface UserInfo {
  username: string;
  password: string;
}

export interface ProductName {
  shoppingList: string[];
}

export interface MemberInfo {
  firstname: string;
  lastname: string;
  postcode: string;
}

//POM
export class SwagPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //page methods;
  async loginWithUserInfo(userInfo: UserInfo) {
    await this.page.locator('[data-test="username"]').fill(userInfo.username);
    await this.page.locator('[data-test="password"]').fill(userInfo.password);

    await this.page.locator('[data-test="login-button"]').click();
  }

  async shoppingWithProductName(productName: ProductName) {
    for (let i = 0; i < productName.shoppingList.length; i++) {
      // await this.page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      const productLocatorName = productName.shoppingList[i]
        .toLowerCase()
        .replace(/\s+/g, "-");
      await this.page
        .locator(`[data-test="add-to-cart-${productLocatorName}"]`)
        .click();
    }
  }

  async checkoutWithMemberInfo(memberInfo: MemberInfo) {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
    await this.page.locator('[data-test="checkout"]').click();

    await this.page.locator('[data-test="firstName"]').fill(memberInfo.firstname);
    await this.page.locator('[data-test="lastName"]').fill(memberInfo.lastname);
    await this.page.locator('[data-test="postalCode"]').fill(memberInfo.postcode);

    await this.page.locator('[data-test="continue"]').click();
  }

  async finish(){
    await this.page.locator('[data-test="finish"]').click();
  }

  //locators;
  totalPrice():Locator{
    return this.page.locator('[data-test="total-label"]');
  }

  completeMessage():Locator{
    return this.page.locator('[data-test="complete-header"]');
  }


}
