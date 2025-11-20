//09:40 - 

import {test, expect} from'@playwright/test';
import { BnbCodeGen, BookDate, UserInfo } from '../pages/bnb-codegen';

test.describe('bnb codegen test', ()=>{

    //test data
    let bnbCodeGen : BnbCodeGen;
    const URLs = {
        homePgeURL: 'https://automationintesting.online',
    }
    const bookDate : BookDate = {
        checkIn : '18/11/2025',
        checkOut: '21/11/2025',
        range: '3',
    };
    const userInfo: UserInfo = {
        Firstname: 'angela',
        Lastname: 'Hou',
        Email: 'angela@sina.com',
        Phone: '24674526846287',
    }
    const imcompleteUserInfo: UserInfo = {
        Firstname: '',
        Lastname: 'qui',
        Email: 'telsla@sina.com',
        Phone: '24674526846287',
    }
    const invalidbookDate : BookDate = {
        checkIn : '18/11/2025',
        checkOut: '02/11/2025',
        range: '2',
    };

    //nevigation

    test.beforeEach(async({page})=>{
        bnbCodeGen = new  BnbCodeGen(page);
        await page.goto(URLs.homePgeURL,{waitUntil: 'load'});

    });

    //happy path
    test('should book the room successfully with user info', async({page})=>{
        // step: fill the book date

        await test.step('fill the date and book', async()=>{
            await bnbCodeGen.fillDateAndBook(bookDate);
        });

        // step: check the info and reserve
        await test.step('check the info and reserve', async()=>{
            await expect.soft(bnbCodeGen.selectedTag()).toBeVisible();
            await expect.soft(bnbCodeGen.summaryInfo()).toContainText(`${bookDate.range} nights`);
            await bnbCodeGen.reserveRoom();
        });

        //step: fill info and confirm
        await test.step('fill info and confirm',async()=>{
            await bnbCodeGen.confirmWithUserInfo(userInfo);
        });

        //step: check success
        await test.step('verify success',async()=>{
            await expect(bnbCodeGen.successInfo()).toBeVisible();
        });

    });


    //negative path
    test('should fail booking the room with incomplete user info', async({page})=>{
        // step: fill the book date

        await test.step('fill the date and book', async()=>{
            await bnbCodeGen.fillDateAndBook(bookDate);
        });

        // step: check the info and reserve
        await test.step('check the info and reserve', async()=>{
            await expect.soft(bnbCodeGen.selectedTag()).toBeVisible();
            await expect.soft(bnbCodeGen.summaryInfo()).toContainText(`${bookDate.range} nights`);
            await bnbCodeGen.reserveRoom();
        });

        //step: fill info and confirm
        await test.step('fill info and confirm',async()=>{
            await bnbCodeGen.confirmWithUserInfo(imcompleteUserInfo);
        });

        //step: check success
        await test.step('verify success',async()=>{
            await expect(bnbCodeGen.successInfo()).not.toBeVisible();
        });

    });


    //edge case
    test('should fail booking the room with invalid date', async({page})=>{
        // step: fill the book date

        await test.step('fill the date and book', async()=>{
            await bnbCodeGen.fillDateAndBook(invalidbookDate);
        });

        //step: button is disabled with error message
        await test.step('check the error message',async()=>{
            await expect.soft(bnbCodeGen.errorMessage()).toBeVisible();
        });


        // step: check the info and reserve
        // await test.step('check the info and reserve', async()=>{
        //     await expect.soft(bnbCodeGen.selectedTag()).toBeVisible();
        //     await expect.soft(bnbCodeGen.summaryInfo()).toContainText(`${bookDate.range} nights`);
        //     await bnbCodeGen.reserveRoom();
        // });

        // //step: fill info and confirm
        // await test.step('fill info and confirm',async()=>{
        //     await bnbCodeGen.confirmWithUserInfo(userInfo);
        // });

        // //step: check success
        // await test.step('verify success',async()=>{
        //     await expect(bnbCodeGen.successInfo()).toBeVisible();
        // });

    });

});

//10:30