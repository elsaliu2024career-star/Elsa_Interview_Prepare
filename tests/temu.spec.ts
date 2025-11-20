//13:28

import {test, expect} from '@playwright/test';
import { TemuPage, UserInfo, ProductInfo } from '../pages/temu';

test.describe('test the product store', ()=>{

    //navigate
    let temuPage: TemuPage; 
    const productInfo: ProductInfo = {
            productName: 'Samsung galaxy s6',
            productPrice: '360',
            productNumer: '1',
    };


    test.beforeEach(async({page})=>{
        temuPage = new TemuPage(page);
        await page.goto('https://www.demoblaze.com/index.html',{waitUntil: 'load'});
    });
    //happy path    
    test('should shopping and check out succeffully', async({page})=>{
        // test data

        const userInfo: UserInfo = {
            name: 'elsa',
            country: 'CHN',
            city: 'MEL',
            card: '3333',
            month: '12',
            year: '1988',
        }


        // step: slect the product
        await test.step('slect the product', async()=>{
            await temuPage.checkDetail(productInfo);
        });

        // step: add to cat
        await test.step('add to cart', async()=>{
            await temuPage.addToCart(productInfo);
        });

        //step: check out
        await test.step('verify total price and place order', async()=>{
            const price = await temuPage.verifyTotalPriceAndPlaceOrder();
            expect(Number(price)).toBe(Number(productInfo.productPrice)* Number(productInfo.productNumer));
        });

        //step: fill info
        await test.step('fill user info and purchase', async()=>{
            await temuPage.fillUserInfoAndPurchase(userInfo);
        })

        //verify success

        await test.step('verify success message', async()=>{
            const isMessageVisible = await temuPage.isSuccessMessageVisible();
            expect(isMessageVisible).toBeTruthy();
        });
    });

    //negative case

    test('should fail purchase when user info missed in the form', async({page})=>{
        // test data

        const userInfo: UserInfo = {
            name: '',
            country: 'CHN',
            city: '',
            card: '',
            month: '12',
            year: '1988',
        }


        // step: slect the product
        await test.step('slect the product', async()=>{
            await temuPage.checkDetail(productInfo);
        });

        // step: add to cat
        await test.step('add to cart', async()=>{
            await temuPage.addToCart(productInfo);
        });

        //step: check out
        await test.step('verify total price and place order', async()=>{
            const price = await temuPage.verifyTotalPriceAndPlaceOrder();
            expect(Number(price)).toBe(Number(productInfo.productPrice)* Number(productInfo.productNumer));
        });

        //step: fill info
        await test.step('fill user info and purchase', async()=>{
            await temuPage.fillUserInfoAndPurchase(userInfo);
        })

        //verify success

        await test.step('verify success message', async()=>{
            const isMessageVisible = await temuPage.isSuccessMessageVisible();
            expect(isMessageVisible).not.toBeTruthy();
        });

    });

    //edge case
    test('should fail to purchase when nothing selected', async({page})=>{
        // test data
    //     const invalidProductInfo: ProductInfo = {
    //         productName: 'Samsung galaxy s6',
    //         productPrice: '360',
    //         productNumer: '0',
    // };

        const userInfo: UserInfo = {
            name: 'elsa',
            country: 'CHN',
            city: 'MEL',
            card: '3333',
            month: '12',
            year: '1988',
        }


        // // step: slect the product
        // await test.step('slect the product', async()=>{
        //     await temuPage.checkDetail(productInfo);
        // });

        // // step: add to cart
        // await test.step('add to cart', async()=>{
        //     await temuPage.addToCart();
        // });

        //step: check out
        await test.step('place order', async()=>{
            await temuPage.checkoutDirectly();
            // expect(Number(price)).toBe(Number(productInfo.productPrice)* Number(productInfo.productNumer));
        });

        //step: fill info
        await test.step('fill user info and purchase', async()=>{
            await temuPage.fillUserInfoAndPurchase(userInfo);
        })

        //verify success

        await test.step('verify success message', async()=>{
            const isMessageVisible = await temuPage.isSuccessMessageVisible();
            expect(isMessageVisible).not.toBeTruthy();
        });
    });


});

//14:26