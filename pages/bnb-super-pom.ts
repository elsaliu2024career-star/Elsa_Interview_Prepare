import { Page } from "@playwright/test";

export interface UserInfo {
  Firstname: string;
  Lastname: string;
  Email: string;
  Phone: string;
}

export interface DateInfo {
    checkIn: string,
    checkOut: string,
}

export class SuperPom {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillDateAndBook(date: DateInfo): Promise<boolean> {
    await this.page.locator('input[type="text"]').first().fill(date.checkIn);
    await this.page
      .locator("div")
      .filter({ hasText: /^Check Out$/ })
      .getByRole("textbox")
      .fill(date.checkOut);

    const [response] = await Promise.all([
      this.page.waitForResponse((res) => res.url().includes("reservation")),
      await this.page
        .locator("div")
        .filter({ hasText: /^£100 per nightBook now$/ })
        .getByRole("link", { name: "Book now" })
        .click(),
    ]);

    return response?.ok() ?? false;
  }

  async getSummaryInfoAndReserve(): Promise<string> {
    const summaryInfo =
      (await this.page
        .locator(".justify-content-between:nth-child(2) > span:nth-child(1)")
        .textContent()) ?? "";
    await this.page.getByRole("button", { name: "Reserve Now" }).click();

    return summaryInfo;
  }

  async fillUserInfo(userInfo: UserInfo) {
    for (const [item, text] of Object.entries(userInfo)) {
      await this.page.getByPlaceholder(item).fill(text);
    }

    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    const isVisible = await this.page
      .getByRole("heading", { name: "Booking Confirmed" })
      .isVisible();
    return isVisible;
  }

  async getAlert(): Promise<string> {
    const alert = (await this.page.locator(".alert").textContent()) ?? "";
    return alert;
  }
}
