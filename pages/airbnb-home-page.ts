import { Locator, Page } from "@playwright/test";
import { BnbTools } from "../utils/bnb-tools";

export class BnbHomePage{
    protected readonly page: Page;
    protected readonly locatorMap: Record<string, Locator>;
    protected readonly bnbTool: BnbTools

    constructor(page:Page){
        this.page = page;
        this.bnbTool = new BnbTools(page);
        this.locatorMap = {
            checkIndateFrom: page.locator('div').filter({ hasText: /^Check In$/ }).getByRole('textbox'),
            checkOutdataForm: page.locator('div').filter({ hasText: /^Check Out$/ }).getByRole('textbox'),
            fistRoomPrice: page.locator('.col-md-6:nth-child(1) .fw-bold'),
            firstRoonBookButton: page.locator('.col-md-6:nth-child(1) .btn'),
        };
    }

    async navigateToHomePage(url: string) {
        await this.bnbTool.navigateToURL(url);
    }

    async fillDate(date: string, dateType: "checkIn" | "checkOut") {
        await this.bnbTool.fillTheForm(this.locatorMap[dateType === "checkIn" ? "checkIndateFrom" : "checkOutdataForm"], date);
    }

    async getContent(item: string){
        await this.bnbTool.getTextContent(this.locatorMap[item]);
    }

    async clickBotton(item: string){
        await this.bnbTool.safeClick(this.locatorMap[item]);
    }

}