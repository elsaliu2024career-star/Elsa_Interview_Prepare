//10:05
import { expect, test } from "@playwright/test";
import { SuperPom, UserInfo } from "../pages/bnb-super-pom";


test.describe("bnb application test", () => {
  // data
  const homePageURL = "https://automationintesting.online/";
  let superPOM: SuperPom;
  
  //navigate to the url before each test
  test.beforeEach(async ({ page }) => {
    superPOM = new SuperPom(page);
    await page.goto(homePageURL, { waitUntil: "load" });
  });

  // happy path
  test("should book the room successfully with user info", async ({ page }) => {
    //test data

    const date = {
      checkIn: "18/11/2025",
      checkOut: "20/11/2025",
      range: "2",
    };
    
    const userInfo: UserInfo = {
      Firstname: "MIDIInput",
      Lastname: "liumin",
      Email: "elsasina@setInterval.com",
      Phone: "432642677582",
    };

    await test.step("fill in the date and book", async () => {
      const bookSuccess = await superPOM.fillDateAndBook(date);
      expect(bookSuccess).toBeTruthy();
    });

    await test.step("verify the summary and reserve", async () => {
      const summaryInfo = await superPOM.getSummaryInfoAndReserve();
      expect(summaryInfo).toContain(`${date.range} nights`);
    });

    await test.step("fill the info and reserve", async () => {
      await superPOM.fillUserInfo(userInfo);
    });

    await test.step("check the message", async () => {
      const isMessageVisible = await superPOM.isSuccessMessageVisible();
      expect(isMessageVisible).toBeTruthy();
    });
  });

  //negative path
  test("Should fail book when user info missed in the form", async ({
    page,
  }) => {
    //test data

    const date = {
      checkIn: "18/11/2025",
      checkOut: "20/11/2025",
      range: "2",
    };
    const userInfo = {
      Firstname: "",
      Lastname: "",
      Email: "elsasina@setInterval.com",
      Phone: "432642677582",
    };
    const message: RegExp = /Firstname should not be blank/i;

    await test.step("fill in the date and book", async () => {
      const bookSuccess = await superPOM.fillDateAndBook(date);
      expect(bookSuccess).toBeTruthy();
    });

    await test.step("verify the summary and reserve", async () => {
      const summaryInfo = await superPOM.getSummaryInfoAndReserve();
      expect(summaryInfo).toContain(`${date.range} nights`);
    });

    await test.step("fill the info and reserve", async () => {
      await superPOM.fillUserInfo(userInfo);
    });

    await test.step("check the message", async () => {
      const isMessageVisible = await superPOM.isSuccessMessageVisible();
      const alert = await superPOM.getAlert();
      expect(alert).toMatch(message);
      expect(isMessageVisible).not.toBeTruthy();
    });
  });

  //edge case
  test("should fail with invalid date", async ({ page }) => {
    //test data
    const date = {
      checkIn: "18/11/2025",
      checkOut: "15/11/2025",
      range: "2",
    };

    await test.step("fill in the date and book", async () => {
      const bookSuccess = await superPOM.fillDateAndBook(date);
      expect(bookSuccess).not.toBeTruthy();
    });
  });
});

//10:57
