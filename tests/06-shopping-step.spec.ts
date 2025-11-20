//16:52
import {expect, test} from '@playwright/test';
import { ProductInfo, StepTest, OrderInfo } from '../pages/02-step';

test.describe('shopping app test step by step', ()=>{

    //test data
    let stepTest: StepTest;
    const URLs = {
        homePage: 'https://www.demoblaze.com/index.html',
    };
    const productInfo: ProductInfo = {
        name: 'Samsung galaxy s6',
        quantity: '3'
    };
    const orderInfo: OrderInfo ={
        name: 'elsa',
        country: 'au',
        city: 'mel',
        card: '222',
        month: '12',
        year: '2025'
    };
    //negative
    const incompleteOrderInfo: OrderInfo ={
        name: '',
        country: 'au',
        city: 'mel',
        card: '222',
        month: '12',
        year: '2025'
    };
    //edge
        const invalidProductInfo: ProductInfo = {
        name: 'Samsung galaxy s6',
        quantity: '0'
    };


    //navigation
    test.beforeEach(async({page})=>{
        stepTest = new StepTest(page);
        await page.goto(URLs.homePage,{waitUntil: 'load'});
    });


    //happy
    test('Should purchase successfully with info',async({page})=>{

        let pricePerProduct: string;

        //step: choose the product
        await test.step('choose the product', async()=>{
            await stepTest.chooseProduct(productInfo);
        });

        //step: add to cart
        await test.step('add the product* number to cart', async()=>{
            await stepTest.addToCartWithQuantityTimes(productInfo);
            pricePerProduct = await stepTest.getPricePerProduct();
        });

        //step: go to cart and confirm
        await test.step('go to cart and confirm', async()=>{
            const totalPrice  = await stepTest.gotoCartAndPlaceOrder();
            expect.soft(Number(totalPrice)).toBe(Number(pricePerProduct.replace('$', ''))*Number(productInfo.quantity));
        });

        //step: place order with Info
        await test.step('place order with Info', async()=>{
            await stepTest.placeOrderWithInfo(orderInfo);
        });

        //step: check success
        await test.step('check success', async()=>{
            await expect(stepTest.successMessage()).toBeVisible();
        });


    });

    //edge
    test('Should fail purchasing with 0 quantity',async({page})=>{

        let pricePerProduct: string;

        //step: choose the product
        await test.step('choose the product', async()=>{
            await stepTest.chooseProduct(invalidProductInfo);
        });

        //step: add to cart
        await test.step('add the product* number to cart', async()=>{
            await stepTest.addToCartWithQuantityTimes(invalidProductInfo);
            pricePerProduct = await stepTest.getPricePerProduct();
        });

        //step: go to cart and confirm
        await test.step('go to cart and confirm', async()=>{
            const totalPrice  = await stepTest.gotoCartAndPlaceOrder();
            expect.soft(Number(totalPrice)).toBe(0);
            // expect.soft(Number(totalPrice)).toBe(Number(pricePerProduct.replace('$', ''))*Number(invalidProductInfo.quantity));
        });

        // //step: place order with Info
        // await test.step('place order with Info', async()=>{
        //     await stepTest.placeOrderWithInfo(orderInfo);
        // });

        // //step: check success
        // await test.step('check success', async()=>{
        //     await expect(stepTest.successMessage()).not.toBeVisible();
        // });


    });


    //negative 
    test('Should fail purchasing with incomplete info',async({page})=>{
        let pricePerProduct: string;

        //step: choose the product
        await test.step('choose the product', async()=>{
            await stepTest.chooseProduct(productInfo);
        });

        //step: add to cart
        await test.step('add the product* number to cart', async()=>{
            await stepTest.addToCartWithQuantityTimes(productInfo);
            pricePerProduct = await stepTest.getPricePerProduct();
        });

        //step: go to cart and confirm
        await test.step('go to cart and confirm', async()=>{
            const totalPrice  = await stepTest.gotoCartAndPlaceOrder();
            expect.soft(Number(totalPrice)).toBe(Number(pricePerProduct.replace('$', ''))*Number(productInfo.quantity));
        });

        //step: place order with Info
        await test.step('place order with Info', async()=>{
            await stepTest.placeOrderWithInfo(incompleteOrderInfo);
        });

        //step: check success
        await test.step('check success', async()=>{
            await expect(stepTest.successMessage()).not.toBeVisible();
        });


    });


});