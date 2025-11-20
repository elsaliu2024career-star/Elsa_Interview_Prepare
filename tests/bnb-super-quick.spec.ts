import { test, expect } from "@playwright/test";

//14:45

test.describe("super quick BNB UI test", () => {
  // happy path
  test("should book the room successfully with user info", async ({ page }) => {
    // test data
    const homePageURL = "https://automationintesting.online/";
    const date = {
      checkIn: "17/11/2025",
      checkOut: "19/11/2025",
      timeRang: "2",
    };

    //step: navigate and fill in the info
    await test.step("navigate and fill in the info", async () => {
      await page.goto(homePageURL, { waitUntil: "load" });

      //fill the date
      await page.getByRole("textbox").first().fill(date.checkIn);
      await page.getByRole("textbox").nth(1).fill(date.checkOut);

      //go to the detail page
      const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("reservation")),
        page.getByRole("link", { name: "Book now" }).nth(1).click(),
      ]);
      expect(response?.ok()).toBeTruthy;
    });

    //step: verify and  book and confirm
    await test.step("verify the price and confirm", async () => {
      const orderInfo = await page.locator("form").textContent();
      expect(orderInfo).toContain(`${date.timeRang} nights`);
      await page.getByRole("button", { name: "Reserve Now" }).click();
    });

    // fill infor and verify success;

    await test.step("should success", async () => {
      await page.getByRole("textbox", { name: "Firstname" }).fill("elsa");
      await page.getByRole("textbox", { name: "Lastname" }).fill("list");
      await page.getByRole("textbox", { name: "Email" }).fill("elsa@email.com");
      await page.getByRole('textbox', { name: 'Phone' }).fill('12398765432');

      await page.getByRole('button', { name: 'Reserve Now' }).click(); 
      await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    });
  });
});

//15:12