import { test, expect } from "@playwright/test";
import { SimpleBnbPage } from "../pages/bnb-simple";
//22:00
test.describe('Bnb app test', ()=>{
    //initialization
    const bnbURL = 'https://automationintesting.online/';


    //happy path
    test('should book the room successfully with user info', async({page})=>{
        //test data
        const simplePOM = new SimpleBnbPage(page);
        const date ={
            checkIn: '17/11/2025',
            checkOut: '19/11/2025',
            range: '2',
        }
        const userInfo = {
            FirstName: 'elsa',
            LastName: 'tesiu',
            Email: 'test@gmail.com',
            Phone: '1234567890123',
        };


        //step: navigate and set the date
        await test.step('navigate and set the date', async()=>{
            await page.goto(bnbURL, {waitUntil: 'load'});
            //fill in date
            await page.getByRole('textbox').first().fill(date.checkIn);
            await page.getByRole('textbox').nth(1).fill(date.checkOut);

            // await page.getByRole('link', { name: 'Book now' }).nth(1).click();
            await simplePOM.clickNavigation(page.getByRole('link', { name: 'Book now' }).nth(1));

        });

        //step: check the summary info and reserve
        await test.step('check the summary info and reserve', async()=>{
            const summaryText = (await page.locator('.justify-content-between:nth-child(2)').textContent()) ?? '';
            expect.soft(summaryText).toContain(`${date.range} nights`);

            await page.getByRole('button', { name: 'Reserve Now' }).click();
        });

        //step: fill the user info and confirm
        await test.step('fill the user info and confirm', async()=>{
            for(const [item, info] of Object.entries(userInfo)){
                await page.getByPlaceholder(item).fill(info);
            };

            await page.getByRole('button', { name: 'Reserve Now' }).click();

        });


        //step: verify the success message
        await test.step('verify the success message', async()=>{
            await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
        });
    });

    //negative path




    //edge case

});