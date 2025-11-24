
//14:25 -15:05

import {test,expect} from '@playwright/test'
import { RoomInfo, RoomRecord, CustomerInfo } from '../pages/07-bnb-record';

test.describe('Test booking App', ()=>{

    //data setup
    const URLs = {
        homesPage: 'https://automationintesting.online/',
    };	
	const roomInfo: RoomInfo = {
        checkinDate: 'Tuesday, 25 November',
        checkoutDate: 'Thursday, 27 November',
    };
    let roomRecord: RoomRecord;
    const customerInfo:CustomerInfo ={
        Firstname: 'Amy',
        Lastname: 'Yang',
        Email: 'shirley@gamil.com',
        Phone: '12345678264785'
    };
    //egde case
    const invalidRoomInfo: RoomInfo = {
        checkinDate: 'Thursday, 27 November',
        checkoutDate: 'Tuesday, 25 November',
    };


    //navigation/setup	
	test.beforeEach(async({page})=>{
        roomRecord = new RoomRecord(page);
        await page.goto(URLs.homesPage);
    });
	

    //happy path test
	
    test('should book the room with valid info',async({page})=>{
        

        await test.step('fill the date range',async()=>{
            await roomRecord.booktheRoomWithRange(roomInfo);
        });
        

        await test.step('check the total price info and reserve',async()=>{
            await expect.soft(roomRecord.TotalPrice()).toBeVisible();
            await roomRecord.reserveRoom();
        });        


        await test.step('fill the user info and confirm',async()=>{
            await roomRecord.fillInfoAndConfirm(customerInfo);
        });

        await test.step('check the success info', async()=>{
            await expect(roomRecord.successInfo()).toBeVisible();
        });
        

    });

    //edge case test
    test('should fail booking with invalid info',async({page})=>{

         await test.step('fill the date range',async()=>{
            await roomRecord.booktheRoomWithRange(roomInfo);
        });
        

        await test.step('check the failure info',async()=>{
            await expect.soft(roomRecord.TotalPrice()).toBeVisible();
        });        

	
	});





    


});
