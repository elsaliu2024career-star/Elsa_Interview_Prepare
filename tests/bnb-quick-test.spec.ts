import { test, expect, Locator } from "@playwright/test";
import { QuickTools } from "../utils/quick-tools"; 
//13:16

test.describe('test the quick airBnb app',()=>{
    // test data

    //happy path
    test('test the quick airBnb app', async({page})=>{

    //initialization/ test data
        const quickTool =  new QuickTools(page);
        const homePageURL = 'https://automationintesting.online/';
        const locatorMap: Record<string, Locator> = {
        checkIn: page.locator('div').filter({ hasText: /^Check In$/ }).getByRole('textbox'),
        checkOut: page.locator('div').filter({ hasText: /^Check Out$/ }).getByRole('textbox'),
        room1Book: page.locator('div').filter({ hasText: /^£100 per nightBook now$/ }).getByRole('link', { name: 'Book now' }),
        summaryInfo: page.locator('.justify-content-between:nth-child(2) > span:nth-child(1)'),
        reserveNow: page.getByRole('button', { name: 'Reserve Now' }),
        formFirstName: page.getByPlaceholder('Firstname'),
        formLastName: page.getByPlaceholder('Lastname'),
        formEmail: page.getByPlaceholder('Email'),
        formPhone: page.getByPlaceholder('Phone'),
        successMessage: page.getByRole('heading', { name: 'Booking Confirmed' }),
    };
        const date = {
            inDate: '17/11/2025',
            outDate: '19/11/2025',
            range: '2',
        };
        const successCode = 200;
        const userInfo = {
          formFirstName: 'elsa',
       formLastName: 'tesiu',
       formEmail: 'elsa.tt@sina.com',
      formPhone: '04410997825',
    };

    //step: navigate to the homepage and fill in the data
    await test.step('navigate and book the room with data', async()=>{
        await quickTool.navigateToURL(homePageURL);
        await quickTool.fillText(locatorMap.checkIn,date.inDate);
        await quickTool.fillText(locatorMap.checkOut,date.outDate);
        expect.soft(await quickTool.getClickStatusCode(locatorMap.room1Book)).toBe(successCode);
    });

    //step: select one room and fill in user info
    await test.step('verify the summary info and book the room', async()=>{
        const summaryText = await quickTool.getText(locatorMap.summaryInfo);
        expect(summaryText).toContain(date.range);
        await quickTool.safeClick(locatorMap.reserveNow);
    });

    //step: check out and verify success message

    await test.step('fill the info and verify success message', async()=>{
        
        for(const [item, text] of Object.entries(userInfo)){
            await quickTool.fillText(locatorMap[item], text);
        };
        await quickTool.safeClick(locatorMap['reserveNow']);
        expect(await quickTool.getText(locatorMap.successMessage)).toContain('Confirmed');
    });


    });

});
 //14:08