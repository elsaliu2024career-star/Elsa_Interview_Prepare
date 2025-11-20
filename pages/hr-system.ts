import { Locator, Page } from "@playwright/test";

export interface UserCredential {
  Username: string;
  Password: string;
}

export interface LeaveRequestInfo {
    leaveType: string;
    fromDate: string;
    toDate: string;
}

export class HRsystem {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginWithUserInfo(userInfo: UserCredential) {
    await this.page.getByPlaceholder("Username").fill(userInfo.Username);
    await this.page.getByPlaceholder("Password").fill(userInfo.Password);

    await Promise.all([
      this.page.getByRole("button", { name: "Login" }).click(),
      this.page.waitForResponse(
        (res) => res.url().includes("dashboard") && res.ok()
      ),
    ]);
  }

  async fillLeaveRequest(leaveInfo: LeaveRequestInfo) {

    await this.page.getByText("-- Select --").click();
    await this.page.getByRole("option", { name: leaveInfo.leaveType }).click();

    await this.page.getByRole("textbox", { name: "yyyy-dd-mm" }).first().fill(leaveInfo.fromDate);

    await this.page.getByRole("textbox", { name: "yyyy-dd-mm" }).nth(1).fill(leaveInfo.toDate);
    await this.page.getByRole("button", { name: "Apply" }).click();
  }

  async getLeaveSuccessMessage(leaveInfo: LeaveRequestInfo):Promise<{record: Locator}> {
    return {
        record: this.page.getByText(`${leaveInfo.fromDate} to ${leaveInfo.toDate}`),
    };

    }

}
