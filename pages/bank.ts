import { Locator, Page } from "@playwright/test";

export interface OpenAccountInfo{
    accountType: string;
    fromAccountID: string;
};

export interface LoginInfo{
    username: string;
    password: string;
};

export interface TransferInfo{
    amount: string;
    fromAccount: string;
    toAccount: string;
}

export class BankPage{

    protected readonly page: Page;

    constructor (page:Page){
        this.page = page;
    }

    async openNewAccount(openAccountInfo:OpenAccountInfo): Promise<Locator>{
        
        await this.page.locator('#type').selectOption(openAccountInfo.accountType);
        await this.page.locator('#fromAccountId').selectOption(openAccountInfo.fromAccountID);
        await this.page.getByRole('button', { name: 'Open New Account' }).click();

        // await this.page.locator('#openAccountResult').waitFor({state: 'visible'});
        // const isSuccessMessageVisible = await this.page.locator('#openAccountResult').isVisible();
        return this.page.locator('#openAccountResult');
    }

    async transferFunds(transferInfo: TransferInfo): Promise<Locator>{

        await this.page.locator('#amount').fill(transferInfo.amount);
        await this.page.locator('#fromAccountId').selectOption(transferInfo.fromAccount);
        await this.page.locator('#toAccountId').selectOption(transferInfo.toAccount);

        await this.page.getByRole('button', { name: 'Transfer' }).click();

        // await this.page.locator('#showResult').waitFor({state: 'visible'});
        // const isSuccessMessageVisible = await this.page.locator('#showResult').isVisible();
        return this.page.locator('#showResult');
    }   
}