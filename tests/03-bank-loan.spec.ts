// 14:37

import {test} from'@playwright/test';
import { BankLoan, UserCredential } from '../pages/bank.loan';

test.describe('test the bank loan app', ()=>{


    //test data
    let bankLoan: BankLoan;
    const URLs = {
        homePage: 'https://parabank.parasoft.com/parabank/index.htm',
        loan: 'https://parabank.parasoft.com/parabank/requestloan.htm',
    };
    const userCredential : UserCredential = {
        username : 'tom',
        password : '121343',
    }

    //login
    test.beforeEach(async({page})=>{
        bankLoan = new BankLoan(page);
        await page.goto(URLs.homePage,{waitUntil: 'load'});
        await bankLoan.loginWithUserInfo(userCredential);
    })

    //happy path
    test('should apply loan successfully', async({page})=>{

        //navigate
        await page.goto(URLs.loan,{waitUntil: 'load'});

        //



    });

    //negative case

    //edge case

});