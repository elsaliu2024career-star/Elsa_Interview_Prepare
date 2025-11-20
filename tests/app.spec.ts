import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { ProductDetail } from "../pages/product-detail";
import { Cart } from "../pages/cart";

import { BnbHomePage } from "../pages/airbnb-home-page";
import { RoomPage } from "../pages/airbng-detail-page";

test.describe("App UI tests", () => {
  // test data
  const homePagURL = "https://www.demoblaze.com/index.html";
  const cartPageURL = "https://www.demoblaze.com/cart.html";
  const homePageExpectedValueMap = {
    heading: "PRODUCT STORE",
    samsungLink: "Samsung galaxy s6",
    samsungPrice: "360",
  };
  const orderContent = {
    Name: "elsa",
    Country: "CHN",
    City: "MEL",
    Card: "3333",
    Month: "12",
    Year: "1988",
  };
  const orderSuccessMessage = "Thank you for your purchase";

  // Happy Path
  test(" Should go throw a typical shopping workflow", async ({ page }) => {
    // initilization
    const homePage = new HomePage(page);
    const roomRang = new RoomPage(page);

    const productDetail = new ProductDetail(page);
    const cart = new Cart(page);

    let quantityExpected: number = 3;
    const totalPriceExpected = 360 * quantityExpected;

    //step1: navigate to the app

    await test.step(" Navigate to the home page", async () => {
      const statusCode = await homePage.navigateToHomePage(homePagURL);
      expect.soft(statusCode).toBe(200);
    });

    // step2-4: check the products list is visible
    for (const [title, content] of Object.entries(homePageExpectedValueMap)) {
      await test.step(` the ${title} should load successfully and show the content`, async () => {
        const getContent = await homePage.getProductDetails(title);
        expect.soft(getContent?.trim()).toContain(content);
      });
    }
    //step5: click the product link
    await test.step("click the link and verify the status code", async () => {
      const responseCode = await homePage.clickProductLink("samsungLink");
      expect.soft(responseCode).toBe(200);
    });

    //step6: access into the details and add it to cart
    for (let i = 0; i < quantityExpected; i++) {
      await test.step(`Add ${i + 1} product to the cart`, async () => {
        await productDetail.addProductToCart();
        await page.waitForTimeout(2_000);
      });
    }

    // step7: go to the cart and verify the number and price

    await test.step(" Go to the cart and verify the number and price", async () => {
      const statusCode = await cart.naviagateToPage(cartPageURL);
      expect.soft(statusCode).toBe(200);

      const totalPrice = await cart.getContent("totalPrice");
      expect(Number(totalPrice)).toBe(totalPriceExpected);
    });

    // step8: check out, place the order, verify succeed
    await test.step(" Checkout and place the order", async () => {
      await cart.placeOrder();
      await cart.fillOrder(orderContent);
      const message = await cart.getContent("successMessage");
      expect(message).toContain(orderSuccessMessage);
    });
  });

  // edge case;
  test("should handle orders with large quatity correctlt", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const homePage = new HomePage(page);
    const productDetail = new ProductDetail(page);
    const cart = new Cart(page);

    let quantityExpected: number = 10;
    const totalPriceExpected = 360 * quantityExpected;

    //step1: navigate to the app

    await test.step(" Navigate to the home page", async () => {
      const statusCode = await homePage.navigateToHomePage(homePagURL);
      expect.soft(statusCode).toBe(200);
    });

    //step2: click the product link
    await test.step("click the link and verify the status code", async () => {
      const responseCode = await homePage.clickProductLink("samsungLink");
      expect.soft(responseCode).toBe(200);
    });

    //step3: access into the details and add it to cart
    for (let i = 0; i < quantityExpected; i++) {
      await test.step(`Add ${i + 1} product to the cart`, async () => {
        await productDetail.addProductToCart();
        await page.waitForTimeout(1_000);
      });
    }

    // step4: go to the cart and verify the number and price

    await test.step(" Go to the cart and verify the number and price", async () => {
      const statusCode = await cart.naviagateToPage(cartPageURL);
      expect.soft(statusCode).toBe(200);

      const totalPrice = await cart.getContent("totalPrice");
      expect(Number(totalPrice)).toBe(totalPriceExpected);
    });

    // step5: check out, place the order, verify succeed
    await test.step(" Checkout and place the order", async () => {
      await cart.placeOrder();
      await cart.fillOrder(orderContent);
      const message = await cart.getContent("successMessage");
      expect(message).toContain(orderSuccessMessage);
    });
  });
});



