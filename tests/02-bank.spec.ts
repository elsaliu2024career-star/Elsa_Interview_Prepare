import { test, expect } from "@playwright/test";
import {
  LoginInfo,
  BankPage,
  OpenAccountInfo,
  TransferInfo,
} from "../pages/bank.ts";

test.describe("test bank app", () => {
  //data
  const pageURLs = {
    homePageURL: "https://parabank.parasoft.com/parabank/overview.htm",
    openAccountURL: "https://parabank.parasoft.com/parabank/openaccount.htm",
    transferFundURL: "https://parabank.parasoft.com/parabank/transfer.htm",
  };

  const loginInfo: LoginInfo = {
    username: "tom",
    password: "12345",
  };
  //case 1
  const openAccountInfo: OpenAccountInfo = {
    accountType: "1",
    fromAccountID: "18228",
  };
  const transferInfo: TransferInfo = {
    amount: "888",
    fromAccount: "13122",
    toAccount: "13233",
  };
  let bankPage: BankPage;

  // case2
  const invalidOpenAccountInfo: OpenAccountInfo = {
    accountType: "1",
    fromAccountID: "",
  };
  const invalidTransferInfo: TransferInfo = {
    amount: "",
    fromAccount: "13122",
    toAccount: "13233",
  };

  // navigation
  test.beforeEach(async ({ page }) => {
    bankPage = new BankPage(page);

    await page.goto(pageURLs.homePageURL, { waitUntil: "load" });
    await page.locator('input[name="username"]').fill(loginInfo.username);
    await page.locator('input[name="password"]').fill(loginInfo.password);
    await page.getByRole("button", { name: "Log In" }).click();
  });

  //happy path
  test("should open the account and transfer money successfully", async ({
    page,
  }) => {
    await page.goto(pageURLs.openAccountURL, {
      waitUntil: "load",
    });

    await test.step("should open account", async () => {
      const resultSuccessLocator = await bankPage.openNewAccount(
        openAccountInfo
      );
      await expect(resultSuccessLocator).toBeVisible();
    });

    await test.step("should transder fund", async () => {
      await page.goto(pageURLs.transferFundURL, {
        waitUntil: "load",
      });
      const transferResultSuccessLocator = await bankPage.transferFunds(
        transferInfo
      );
      await expect(transferResultSuccessLocator).toBeVisible();
    });
  });

  //negative path
  test("should fail open the account and transfer money successfully", async ({
    page,
  }) => {
    await test.step("shuld fail opening account", async () => {
      await page.goto(pageURLs.openAccountURL, {
        waitUntil: "load",
      });
      const resultSuccessLocator = await bankPage.openNewAccount(
        invalidOpenAccountInfo
      );
      await expect(resultSuccessLocator).toBeVisible();
    });

    await test.step("should fail transfering fund with invalid info", async () => {
      const transferResultSuccessLocator = await bankPage.transferFunds(
        invalidTransferInfo
      );

      await page.goto(pageURLs.transferFundURL, {
        waitUntil: "load",
      });

      await expect(transferResultSuccessLocator).toBeVisible();
    });
  });

  //edge case
  //tranfer money from an account the banlance is less then $90;
});
