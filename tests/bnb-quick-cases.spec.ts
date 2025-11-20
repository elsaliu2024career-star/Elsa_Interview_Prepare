//17:16

import {test,expect} from '@playwright/test';
import { error } from 'console';

test.describe('airBNB app test', ()=>{

    //intitialization
    const homePageURL = 'https://automationintesting.online/';
        
    //happy path
    test('should book the room successfully with user info', async({page})=>{
        //test data
        // const homePageURL = 'https://automationintesting.online/';
        const userInfo = {
            checkIn: '17/11/2025',
            checkOut: '19/11/2025',
            range: '2',
        }
        const userForm = {
            Firstname: 'telisa',
            LastName: 'mumu',
            Email: 'elsatistest@gamil.com',
            Phone: '4238569324657',
        };

        //step: navigate to the homepage and fill date
        await test.step('navigate and fill date', async()=>{
            await page.goto(homePageURL, {waitUntil: 'load'});
            
            await page.getByRole('textbox').first().fill(userInfo.checkIn);
            await page.getByRole('textbox').nth(1).fill(userInfo.checkOut);

            const [response] = await Promise.all([
                page.waitForResponse((res)=> res.url().includes('reservation')),
                await page.getByRole('link', { name: 'Book now' }).nth(1).click(),
            ]);
            
            expect(response?.ok()).toBeTruthy();

        });
        // step: verify the summary info and reserve now
        await test.step('verify the summary info and reserve now', async()=>{

            const summaryText = (await page.locator('.justify-content-between:nth-child(2) > span:nth-child(1)').textContent()) ?? '';
            expect.soft(summaryText).toContain(`${userInfo.range} nights`);

            await page.getByRole('button', { name: 'Reserve Now' }).click();

            for(const [item, info] of Object.entries(userForm)){
                await page.getByRole('textbox', { name: item }).fill(info);
            };

            await page.getByRole('button', { name: 'Reserve Now' }).click();

        });

        //step: verify success message
        await test.step('verify success message', async()=>{
            await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
        });


    });

    //negative path
    test('should not book the room with incomplete user info', async({page})=>{
        //test data
        // const homePageURL = 'https://automationintesting.online/';
        const userInfo = {
            checkIn: '17/11/2025',
            checkOut: '19/11/2025',
            range: '2',
        }
        const userForm = {
            Firstname: '',
            LastName: 'tesiu',
            Email: 'elsatest@gamil.com',
            Phone: '',
        };

        //step: navigate to the homepage and fill date
        await test.step('navigate and fill date', async()=>{
            await page.goto(homePageURL, {waitUntil: 'load'});
            
            await page.getByRole('textbox').first().fill(userInfo.checkIn);
            await page.getByRole('textbox').nth(1).fill(userInfo.checkOut);

            const [response] = await Promise.all([
                page.waitForResponse((res)=> res.url().includes('reservation')),
                page.getByRole('link', { name: 'Book now' }).nth(1).click(),
            ]);
            
            expect(response?.ok()).toBeTruthy();

        });

        // step: verify the summary info and reserve now
        await test.step('verify the summary info and reserve now', async()=>{

            const summaryText = (await page.locator('.justify-content-between:nth-child(2) > span:nth-child(1)').textContent()) ?? '';
            expect.soft(summaryText).toContain(`${userInfo.range} nights`);

            await page.getByRole('button', { name: 'Reserve Now' }).click();

            for(const [item, info] of Object.entries(userForm)){
                await page.getByRole('textbox', { name: item }).fill(info);
            };

            await page.getByRole('button', { name: 'Reserve Now' }).click();

        });

        //step: verify success message
        await test.step('verify success message', async()=>{
            await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).not.toBeVisible();
            const errorMessage = await page.locator('.alert').textContent();
            expect(errorMessage).toContain('Firstname should not be blank');
            expect(errorMessage).toContain('size must be between 11 and 21');
        });

    });
    // edge case

    test('should not book the room with invalid date', async({page})=>{
        //test data
        const userInfo = {
            checkIn: '20/11/2025',
            checkOut: '19/11/2025',
            range: '2',
        };
        //step: navigate to the homepage and fill date
        await test.step('navigate and fill date', async()=>{
            await page.goto(homePageURL, {waitUntil: 'load'});
            await page.getByRole('textbox').first().fill(userInfo.checkIn);
            await page.getByRole('textbox').nth(1).fill(userInfo.checkOut);

            const [response] = await Promise.all([
                page.waitForResponse((res)=> res.url().includes('reservation')),
                await page.getByRole('link', { name: 'Book now' }).nth(1).click(),
            ]);
            
            expect(response?.ok()).toBeTruthy();
        });

        await test.step('the selected option is not valid', async()=>{
            await expect(page.getByText('Selected')).not.toBeVisible();
        });

    });

});

//17:48

// adding a more conciese version at night:
// by adding some useful helpers
// not set up locator map
// no POM