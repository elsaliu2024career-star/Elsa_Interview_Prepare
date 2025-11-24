import { Locator, Page } from "@playwright/test";

export interface RoomInfo {
  checkinDate: string;
  checkoutDate: string;
}

export interface CustomerInfo {
  Firstname: string;
  Lastname: string;
  Email: string;
  Phone: string;
}

export class RoomRecord {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async booktheRoomWithRange(roomInfo: RoomInfo) {
    await this.page.getByRole("textbox").first().click();
    await this.page
      .getByRole("option", { name: `Choose ${roomInfo.checkinDate}` })
      .click();

    await this.page.getByRole("textbox").nth(1).click();
    await this.page
      .getByRole("option", { name: `Choose ${roomInfo.checkoutDate}` })
      .click();

    await Promise.all([
      this.page.getByRole("link", { name: "Book now" }).nth(3).click(),
      this.page.waitForResponse(
        (res) => res.ok() && res.url().includes("reservation")
      ),
    ]);
  }

  TotalPrice(): Locator {
    return this.page.locator(".d-flex:nth-child(6)");
  }

  async reserveRoom() {
    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  async fillInfoAndConfirm(customerInfo: CustomerInfo) {
    await this.page.getByRole("textbox", { name: "Firstname" }).fill(customerInfo.Firstname);

    await this.page.getByRole("textbox", { name: "Lastname" }).fill(customerInfo.Lastname);

    await this.page
      .getByRole("textbox", { name: "Email" })
      .fill(customerInfo.Email);

    await this.page.getByRole("textbox", { name: "Phone" }).fill(customerInfo.Phone);

    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  successInfo():Locator{
    return this.page.getByRole('heading', { name: 'Booking Confirmed' });
  }

}
