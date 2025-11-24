//17:50 -17:41

import {test, expect} from '@playwright/test';
import { PurchaseTime, ProductInfo, UserInfo } from '../pages/04-purchase-time';
// import { UserInfo } from 'os';


test.describe('test the shopping app in time saveing mode',()=>{

    //test data
    const URLs = {
        homePage: 'https://www.demoblaze.com/index.html',
        cartPge: 'https://www.demoblaze.com/cart.html',
    };
    const productInfo:ProductInfo ={
        name: 'Nokia lumia',
        quantity: '3',
    }
    let purchaseTime:PurchaseTime;
    const userInfo: UserInfo ={
        Name: 'AngelaLiu',
        Country: 'aus',
        City: 'mel',
        Card: '22222',
        Month: '12',
        Year: '2024'
    };
    const invalidProductInfo:ProductInfo ={
        name: 'Nokia lumia',
        quantity: '0',
    }


    //navigate
    test.beforeEach(async({page})=>{
        purchaseTime = new PurchaseTime(page);
        await page.goto(URLs.homePage);
    });
    

    //happy
    test('should purchase successfully with valid info',async({page})=>{

        let pricePerProduct: number;

        await test.step('choose the product and add to cart', async()=>{
            await purchaseTime.chooseProductAndAddToCart(productInfo);
            await expect.soft(purchaseTime.pricePerProduct()).toBeVisible();
            pricePerProduct = Number(((await purchaseTime.pricePerProduct().textContent()) ?? '').replace(/\D/g, ''));
        });

        await test.step('go to cart and confirm', async()=>{
            await page.goto(URLs.cartPge,{waitUntil: 'load'});
            await expect.soft(purchaseTime.totalPrice()).toBeVisible();
            const totalPrice = Number(((await purchaseTime.totalPrice().textContent()) ?? '').replace(/\D/g, ''));
            expect.soft(totalPrice).toBe(pricePerProduct * Number(productInfo.quantity));
            await purchaseTime.gotoCartPlaceOrder(userInfo);
        });

        await test.step('checkSuceess', async()=>{
            await expect(purchaseTime.successMessage()).toBeVisible();
        });


    });

    //edge
        test('should fail with invalid info',async({page})=>{

        let pricePerProduct: number;

        await test.step('choose the product and add to cart', async()=>{
            await purchaseTime.chooseProductAndAddToCart(invalidProductInfo);
            await expect.soft(purchaseTime.pricePerProduct()).toBeVisible();
            pricePerProduct = Number(((await purchaseTime.pricePerProduct().textContent()) ?? '').replace(/\D/g, ''));
        });

        await test.step('go to cart and confirm', async()=>{
            await page.goto(URLs.cartPge,{waitUntil: 'load'});
            await expect.soft(purchaseTime.totalPrice()).not.toBeVisible();
            const totalPrice = Number(((await purchaseTime.totalPrice().textContent()) ?? '').replace(/\D/g, ''));
            expect.soft(totalPrice).toBe(pricePerProduct * Number(invalidProductInfo.quantity));
            await purchaseTime.gotoCartPlaceOrder(userInfo);
        });

        await test.step('checkSuceess', async()=>{
            await expect(purchaseTime.successMessage()).toBeVisible();
        });


    });

});