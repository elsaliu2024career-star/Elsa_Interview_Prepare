import { Page } from "@playwright/test";

export interface UserCredential {
  username: string;
  password: string;
}

export interface loanInfo{
    amount: string;
    downPayment: string;
    fromAccountId: string;
}

export class BankLoan {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginWithUserInfo(userInfo: UserCredential) {
    await this.page.locator('input[name="username"]').fill(userInfo.username);
    await this.page.locator('input[name="password"]').fill(userInfo.password);

    await Promise.all([
          this.page.getByRole('button', { name: 'Log In' }).click(),
          this.page.waitForResponse((res)=> res.url().includes('login') && res.ok()),
    ]);

  }

  async requestLoanWithInfo(loadUserInfo: loanInfo){
   await this.page.locator('#amount').fill('10023');
  await this.page.locator('#downPayment').fill('34');
  await this.page.getByRole('button', { name: 'Apply Now' }).click();
  }
}
