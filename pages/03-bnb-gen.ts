import { Locator, LocatorScreenshotOptions, Page } from "@playwright/test";

export interface RoomInfo {
  checkInDate: string;
  //Monday, 24 November
  checkOutDate: string;
  //Friday, 28 November
}

export interface UserInfo {
  Firstname: string;
  Lastname: string;
  Email: string;
  Phone: string;
}

export interface PriceInfo {
  pricePerNight: string;
  totalPrice: string;
}

export class BnbGenPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async bookRoomWithDetails(roomInfo: RoomInfo) {
    await this.page.getByRole("textbox").first().click();
    await this.page
      .getByRole("option", { name: `Choose ${roomInfo.checkInDate}` })
      .click();
    await this.page.getByRole("textbox").nth(1).click();
    await this.page
      .getByRole("option", { name: `Choose ${roomInfo.checkOutDate}` })
      .click();
    await this.page.getByRole("button", { name: "Check Availability" }).click();

    await Promise.all([
      this.page.getByRole("link", { name: "Book now" }).nth(2).click(),
      this.page.waitForResponse(
        (res) => res.url().includes("reservation") && res.ok()
      ),
    ]);
  }

  async reserve() {
    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }


  async fillUserInfo(userInfo: UserInfo) {
    await this.page.getByRole("textbox", { name: "Firstname" }).fill(userInfo.Firstname);

    await this.page.getByRole("textbox", { name: "Lastname" }).fill(userInfo.Lastname);

    await this.page.getByRole("textbox", { name: "Email" }).fill(userInfo.Email );

    await this.page.getByRole("textbox", { name: "Phone" }).fill(userInfo.Phone );
    await this.page.getByRole("button", { name: "Reserve Now" }).click();
  }

  selectedIcon(): Locator {
    return this.page.getByText("Selected");
  }

  summaryInfo(): Locator {
    return this.page.locator(".justify-content-between:nth-child(2) > span:nth-child(1)");
  }

  successMessage(): Locator {
    return this.page.getByRole('heading', { name: 'Booking Confirmed' });
  }


}
