import { Locator, Page } from "@playwright/test";
import { BnbTools } from "../utils/bnb-tools";

export class RoomPage {
  protected readonly page: Page;
  protected readonly locatorMap: Record<string, Locator>;
  protected readonly bnbTool: BnbTools;

  constructor(page: Page) {
    this.page = page;
    this.bnbTool = new BnbTools(page);
    this.locatorMap = {
      reserve: page.getByRole("button", { name: "Reserve Now" }),
      timeRange: page.locator(
        ".justify-content-between:nth-child(2) > span:nth-child(1)"
      ),
      formFirstName: page.getByPlaceholder("Firstname"),
      formLastName: page.getByPlaceholder("Lastname"),
      email: page.getByPlaceholder("Email"),
      phone: page.getByPlaceholder("Phone"),
      confirm: page.getByRole('button', { name: 'Reserve Now' }),
      successMessage: page.locator('.card-body > .fs-4'),
    };
  }

  async getContent(item: string): Promise<string> {
    await this.verifyLocator(item);
    return await this.bnbTool.getTextContent(this.locatorMap[item] ?? "");
  }

  async clickBotton(item: string) {
    await this.verifyLocator(item);
    await this.bnbTool.safeClick(this.locatorMap[item]);
  }

  async fillInfo(item: string, content: string) {
    await this.verifyLocator(item);
    await this.bnbTool.fillTheForm(this.locatorMap[item], content);
  }

  async verifyLocator(item: string) {
    if (!this.locatorMap[item]) {
      throw new Error("this item can not be found in this page");
    }
  }

  async clickConfirmed(item: string):Promise<number>{
     const [response] = await Promise.all([
      this.page.waitForResponse((res) => res.ok()),
      this.clickBotton(item),
    ]);
    return response.status();
  }
}
