// 17:03 - 18:06

import {test,expect} from '@playwright/test';
import { Ecommerce, UserCredential, CustomerCredential, MemberInfo } from '../pages/06-ecommerce';

test.describe('test e-commerce APP', ()=>{

    //data setup
    const URLs = {
        logginPage:'https://practice.qabrains.com/',
    };
    const userCredential:UserCredential = {
        email: 'qa_testers@qabrains.com',
        password: 'Password123',
    };
    let ecommerce: Ecommerce;
    const customerCredential: CustomerCredential = {
        email: 'test@qabrains.com',
        password: 'Password123',
    };
    const productInfo : number[] = [
        3,
        4,
    ]
    const memberInfo: MemberInfo={
        firstname: 'elsa',
        lastname: 'liu',
        postcode: '3164',
    }
    // edge case
    const invalidCustomerCredential: CustomerCredential = {
        email: 'testliu@qabrains.com',
        password: 'Password123',
    };

    //navigation/setup
    test.beforeEach(async({page})=>{
        ecommerce = new Ecommerce(page);
        await page.goto(URLs.logginPage,{waitUntil: 'load'});
        await ecommerce.logginWithCredential(userCredential);
        await expect.soft(ecommerce.loginSuccess()).toBeVisible();

    });

    //happy path teste
    test('should purchase successfully with valid info',async({page})=>{
        
        await ecommerce.gotoShoppingPage(customerCredential);
        //step
        await test.step('add product list into cart',async()=>{
            await ecommerce.addProductList(productInfo);
        });

        await test.step('checkout with Info', async()=>{
            await ecommerce.checkoutwithInfo(memberInfo);
            await expect(ecommerce.totalPrice()).toBeVisible();
        });


        //step
        await test.step('finish shopping',async()=>{
            await ecommerce.finishShopping();
        });
        

        //step
        await test.step('check success',async()=>{
            await expect.soft(ecommerce.thanksForOrder()).toBeVisible();
        });       

    });

    //edge case test
    test('should fail with invalid info ',async({page})=>{
	
        await ecommerce.gotoShoppingPage(invalidCustomerCredential);
                
        //step
        await expect.soft(ecommerce.usernameIncorrect()).toBeVisible();	
	
	
	});





    


});