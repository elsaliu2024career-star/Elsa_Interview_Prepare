//14:36
import {expect, test} from '@playwright/test';
import { ShoppingPOM, ProductInfo, OderInfo } from '../pages/01-shopping-pom';

test.describe('test shopping app', ()=>{

    //test data
    let shoppingPOM: ShoppingPOM;
    const URLs = {
        homePage: 'https://www.demoblaze.com/index.html'
    }
    const productInfo :ProductInfo = {
        name: 'Samsung galaxy s6',
        quantity: '3',
        price: '360',
    };
    const orderInfo : OderInfo = {
        name: 'elsa',
        country: 'CHN',
        city: 'MEL',
        card: '3333',
        month: '12',
        year: '1988',
    }
    //negative
    const incompleteOrderInfo : OderInfo = {
        name: '',
        country: 'CHN',
        city: 'MEL',
        card: '3333',
        month: '12',
        year: '1988',
    }
    //edge
    const invalidProductInfo :ProductInfo = {
        name: 'Samsung galaxy s6',
        quantity: '0',
        price: '360',
    };

    //navigation
    test.beforeEach(async({page})=>{
        shoppingPOM = new ShoppingPOM(page);
        await page.goto(URLs.homePage,{waitUntil:'load'});
    });


    //happy
    test('should purchase product successfully', async({page})=>{

        //step: choose product
        await test.step('choose the product',async()=>{
            await shoppingPOM.chooseProductByName(productInfo);
        });

        //step: add to cart
        await test.step('check price and add to cart', async()=>{
            // const price = await shoppingPOM.addCart();
            // expect.soft(price).toBe(Number(productInfo.price)*Number(productInfo.quantity));
            for(let i =0; i< Number(productInfo.quantity); i++){
                await shoppingPOM.addCart();
            }
        });

        //step: place order
        await test.step('place order', async()=>{
            const price = await shoppingPOM.placeOrder();
            expect.soft(Number(price)).toBe(Number(productInfo.price)*Number(productInfo.quantity));
            await shoppingPOM.confirmOrderWithInfo(orderInfo);

        });

        //step: check success
        await test.step('check success', async()=>{
            await expect(shoppingPOM.successMessage()).toBeVisible();
        });

    });



    //negative

        test('should fail purchasing product with incomplete oder info', async({page})=>{

        //step: choose product
        await test.step('choose the product',async()=>{
            await shoppingPOM.chooseProductByName(productInfo);
        });

        //step: add to cart
        await test.step('check price and add to cart', async()=>{
            const price = await shoppingPOM.addCart();
            expect.soft(price).toBe(Number(productInfo.price)*Number(productInfo.quantity));
        });

        //step: place order
        await test.step('place order', async()=>{
            await shoppingPOM.confirmOrderWithInfo(incompleteOrderInfo);

        });

        //step: check success
        await test.step('check success', async()=>{
            await expect(shoppingPOM.successMessage()).toBeHidden();
        });

        
    });


    //edge
    test('should fail purchasing product with nothing chosen ', async({page})=>{

        //step: choose product
        await test.step('choose the product',async()=>{
            await shoppingPOM.chooseProductByName(invalidProductInfo);
        });

        //step: add to cart
        await test.step('check price and add to cart', async()=>{
            let price;
            for(let i =0; i< Number(invalidProductInfo.quantity); i++){
            price = await shoppingPOM.addCart();
            };

            expect.soft(price).toBe(Number(invalidProductInfo.price)*Number(invalidProductInfo.quantity));
        });

        //step: place order
        await test.step('place order', async()=>{
            await shoppingPOM.confirmOrderWithInfo(orderInfo);

        });

        //step: check success
        await test.step('check success', async()=>{
            await expect(shoppingPOM.successMessage()).toBeHidden();
        });

        
    });



});

//15:26  50min