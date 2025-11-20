import {test, expect} from '@playwright/test'
import { QuickPOM } from '../pages/quick-pom';
//20:38

test.describe('BNB booking test', ()=>{

    // user data
    const date = {
        checkIn:  '17/11/2025',
        checkOut: '19/11/2025',
        range: '2',
    }


    //navigate to home page;

    //happy path
    test('should book the room successfully with user info', async({page})=>{
        // inport POM, data
        const quickPOM =  new QuickPOM(page);

        const bookingData ={
        FirstName: 'tester',
        LastName: 'avivi',
        Email: 'elsateser@gamil.com',
        Phone: '13278901234',
    }

        //fill in the check in and out date
        await test.step('fill the date', async()=>{
            await quickPOM.fillText(page.getByRole('textbox').first(), date.checkIn);
            await quickPOM.fillText(page.getByRole('textbox').nth(1), date.checkOut);

            await quickPOM.clickNavigation(page.getByRole('link', { name: 'Book now' }).nth(1));

        });
        // step: check and reserve
        await test.step('verify the summary info and reserve', async()=>{
            const summary = await quickPOM.getText(page.locator('form'));
            expect(summary).toContain(`${date.range} nights`);
            await quickPOM.safeClick(page.getByRole('button', { name: 'Reserve Now' }));
        });

        // step: fill the user info and book
        await test.step('fill the user info and book', async()=>{
            for(const [item, detail] of Object.entries(bookingData)){
                await quickPOM.fillText(page.getByRole('textbox', { name: item }), detail);
            };

            await quickPOM.safeClick(page.getByRole('button', { name: 'Reserve Now' }));
        });

        //check the success message
        await test.step('check the final message', async()=>{

        });

    });

    //negative path

    //edge cases

    // cannot meet the time

});