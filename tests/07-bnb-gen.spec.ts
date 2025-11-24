//11:28-11:31
//11:31-12:15

import { expect, test } from '@playwright/test';
import { BnbGenPage, RoomInfo, UserInfo } from '../pages/03-bnb-gen';

test.describe('test the bnb gen app', ()=>{


        //data setup
        let bnbGenPage: BnbGenPage;
        const URLs = {
            homePage: 'https://automationintesting.online/',
        }
        const roomInfo: RoomInfo = {
            checkInDate: 'Monday, 24 November',
            checkOutDate: 'Friday, 28 November',
        };
        const userInfo: UserInfo = {
            Firstname: 'Test',
            Lastname: 'User',
            Email: 'test@example.com',
            Phone: '123456789011233',
        };
        const invalidRoomInfo: RoomInfo = {
            checkInDate: 'Monday, 24 November',
            checkOutDate: 'Friday, 21 November',
        };

        //navigation/setup
        test.beforeEach(async({page})=>{
            //navigation implementation
            bnbGenPage = new BnbGenPage(page);
            await page.goto(URLs.homePage,{waitUntil: 'load'});
        });

        //happy path test

        test('Should complete bnb gen flow successfully',async({page})=>{

        await test.step('fill in the RoomInfo', async()=>{
            await bnbGenPage.bookRoomWithDetails(roomInfo);
        })  ;

         await test.step('check info and reserve', async()=>{
            await expect.soft(bnbGenPage.selectedIcon()).toBeVisible();
            await expect.soft(bnbGenPage.summaryInfo()).toContainText(`${Number(roomInfo.checkOutDate.replace(/\D/g, ''))-Number(roomInfo.checkInDate.replace(/\D/g, ''))} nights`);
            await bnbGenPage.reserve();
         });

         await test.step('fill userinfo and confirmation', async()=>{
            await bnbGenPage.fillUserInfo(userInfo);
         });


        await test.step('check success message', async()=>{
            await expect.soft(bnbGenPage.successMessage()).toBeVisible();
        });

    });

    //edge case test
    test('Should handle edge cases in bnb gen flow',async({page})=>{

        await test.step('fill in the RoomInfo', async()=>{
            await bnbGenPage.bookRoomWithDetails(invalidRoomInfo);
        })  ;

         await test.step('check info and reserve', async()=>{
            await expect.soft(bnbGenPage.selectedIcon()).not.toBeVisible();
            await expect.soft(bnbGenPage.summaryInfo()).toContainText(`${Number(invalidRoomInfo.checkOutDate.replace(/\D/g, ''))-Number(invalidRoomInfo.checkInDate.replace(/\D/g, ''))} nights`);
            await bnbGenPage.reserve();
         });

         await test.step('fill userinfo and confirmation', async()=>{
            await bnbGenPage.fillUserInfo(userInfo);
         });


        await test.step('check success message', async()=>{
            await expect(bnbGenPage.successMessage()).not.toBeVisible();
        });


    });

});