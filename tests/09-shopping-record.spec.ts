//09:19 -10:00

import { test, expect } from "@playwright/test";
import {ShoppingTemplate, ProductInfo} from '../pages/05-shopping-template';
import { OrderInfo } from "../pages/02-step";

test.describe("test the temu shopping app", () => {
  //data setup
  const URLs = {
    homePage: "https://www.demoblaze.com/index.html",
    cartPage: "https://www.demoblaze.com/cart.html",
  };
  const productInfo: ProductInfo = {
    name: "Sony xperia z5",
    quantity: "2",
  };
  let shoppingTemplate: ShoppingTemplate;
  const orderInfo: OrderInfo ={
    name: 'elsa',
    country: 'AUS',
    city: 'MEL',
    card: '122344',
    month: '12',
    year: '2025',
  }
  //edge cae
    const invalidProductInfo = {
    name: "Sony xperia z5",
    quantity: "0",
  };


  //navigation/setup
  test.beforeEach(async ({ page }) => {
    await page.goto(URLs.homePage, { waitUntil: "load" });
    shoppingTemplate = new ShoppingTemplate(page);
  });

  //happy path test
  test("should success with valid info", async ({ page }) => {
    let pricePerProduct: number;
    //step: choose a product
    await test.step("choose a product", async () => {
        await shoppingTemplate.chooseProduct(productInfo);  

    });

    //step: add to cart
    await test.step("add to cart", async () => {
        await expect.soft(shoppingTemplate.pricePerProduct()).toBeVisible();
        pricePerProduct = Number(((await shoppingTemplate.pricePerProduct().textContent()) ?? '').replace(/\D/g, ''));

        await shoppingTemplate.addToCartWithQuantityTimes(productInfo);
    });

    //step: go to cart and confirm
    await test.step("go to cart and check price info", async () => {
        await page.goto(URLs.cartPage, { waitUntil: "load" });
        await expect.soft(shoppingTemplate.totalPrice()).toBeVisible();
        const totalPrice = Number(((await shoppingTemplate.totalPrice().textContent()) ?? '').replace(/\D/g, ''));
        expect.soft(totalPrice).toBe(pricePerProduct * Number(productInfo.quantity));
        
    });

    await test.step("place order", async () => {
        await shoppingTemplate.placeOrder(orderInfo);
    });

    await test.step("check success message", async () => {
        await expect.soft(shoppingTemplate.successMessage()).toBeVisible();
    });


  });

  //edge case test
  test("should fail with invalid info:0 quantity", async ({ page }) => {

 let pricePerProduct: number;
    //step: choose a product
    await test.step("choose a product", async () => {
        await shoppingTemplate.chooseProduct(invalidProductInfo);  

    });

    //step: add to cart
    await test.step("add to cart", async () => {
        await expect.soft(shoppingTemplate.pricePerProduct()).toBeVisible();
        pricePerProduct = Number(((await shoppingTemplate.pricePerProduct().textContent()) ?? '').replace(/\D/g, ''));

        await shoppingTemplate.addToCartWithQuantityTimes(invalidProductInfo);
    });

    //step: go to cart and confirms
    await test.step("go to cart and check price info", async () => {
        await page.goto(URLs.cartPage, { waitUntil: "load" });
        await expect.soft(shoppingTemplate.totalPrice()).toBeHidden();
        // const totalPrice = Number(((await shoppingTemplate.totalPrice().textContent()) ?? '').replace(/\D/g, ''));
        // expect.soft(totalPrice).toBe(pricePerProduct * Number(productInfo.quantity));
        
    });

    await test.step("place order", async () => {
        await shoppingTemplate.placeOrder(orderInfo);
    });

    await test.step("check success message", async () => {
        await expect.soft(shoppingTemplate.successMessage()).not.toBeVisible();
    });


  });





});
