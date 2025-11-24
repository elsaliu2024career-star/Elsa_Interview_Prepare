// 20:38 -21:17  39 min

import { test, expect } from "@playwright/test";
import { SwagPage, UserInfo, ProductName, MemberInfo } from "../pages/08-swag";

test.describe("test swag shopping page", () => {
  //data setup
  const URLs = {
    homePage: "https://www.saucedemo.com/",
  };
  const userInfo: UserInfo = {
    username: "standard_user",
    password: "secret_sauce",
  };
  let swagPage: SwagPage;
  const productName: ProductName = {
    shoppingList: ["Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt"],
  };
  const memberInfo: MemberInfo = {
    firstname: "angela",
    lastname: "liu",
    postcode: "3263",
  };
  //edge case

  //navigation/setup
  test.beforeEach(async ({ page }) => {
    swagPage = new SwagPage(page);
    await page.goto(URLs.homePage);

    await swagPage.loginWithUserInfo(userInfo);
  });

  //happy path test
  test("should purchase successfully with valid info", async ({ page }) => {
    await test.step("add shopping items", async () => {
      await swagPage.shoppingWithProductName(productName);
    });

    await test.step("checkout with customer info", async () => {
      await swagPage.checkoutWithMemberInfo(memberInfo);
      await expect.soft(swagPage.totalPrice()).toBeVisible();
    });

    await test.step("finish and check complete message", async () => {
      await swagPage.finish();
      await expect.soft(swagPage.completeMessage()).toBeVisible();
    });
  });

  //edge case test
  test("should pass with $0 receipt", async ({ page }) => {

    // await test.step("add shopping items", async () => {
    //   await swagPage.shoppingWithProductName(productName);
    // });

    await test.step("checkout with customer info", async () => {
      await swagPage.checkoutWithMemberInfo(memberInfo);
      await expect.soft(swagPage.totalPrice()).toBeVisible();
    });

    await test.step("finish and check complete message", async () => {
      await swagPage.finish();
      await expect.soft(swagPage.completeMessage()).toBeVisible();
    });
  });
});
