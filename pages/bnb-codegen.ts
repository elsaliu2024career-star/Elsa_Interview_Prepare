import { Locator, Page } from "@playwright/test";


export interface BookDate {
  checkIn: string;
  checkOut: string;
  range: string;
}

export interface UserInfo {
  Firstname: string;
  Lastname: string;
  Email: string;
  Phone: string;
}

export class BnbCodeGen {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillDateAndBook(bookDate: BookDate) {
    await this.page.getByRole("textbox").first().fill(bookDate.checkIn);

    await this.page.getByRole("textbox").nth(1).fill(bookDate.checkOut);

    await this.page.getByRole("button", { name: "Check Availability" }).click();

    await Promise.all([
      this.page.getByRole("link", { name: "Book now" }).nth(2).click(),
      this.page.waitForResponse((res) => res.url().includes("reservation") && res.ok()),
    ]);
  }

  async reserveRoom() {
    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  async confirmWithUserInfo(userInfo: UserInfo) {
    await this.page.getByRole("textbox", { name: "Firstname" }).fill(userInfo.Firstname);
    await this.page.getByRole("textbox", { name: "Lastname" }).fill(userInfo.Lastname);
    await this.page.getByRole("textbox", { name: "Email" }).fill(userInfo.Email);
    await this.page.getByRole("textbox", { name: "Phone" }).fill(userInfo.Phone);

    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  summaryInfo(): Locator {
    return this.page.locator(".justify-content-between:nth-child(2) > span:nth-child(1)");
  }

  selectedTag(): Locator {
    return this.page.getByText("Selected");
  }

  successInfo(): Locator{
    return this.page
      .getByRole("heading", { name: "Booking Confirmed" });
  }

  errorMessage(): Locator{
    return this.page.getByText('the date is invalid')
  }

}
