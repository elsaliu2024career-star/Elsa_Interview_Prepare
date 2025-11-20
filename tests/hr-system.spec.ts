//16:18
import { test, expect } from "@playwright/test";
import { HRsystem, LeaveRequestInfo, UserCredential } from "../pages/hr-system";

test.describe("test the hr system app", () => {
  //test data
  let hrSystem: HRsystem;
  const URLs: Record<string, string> = {
    loginPage: "https://opensource-demo.orangehrmlive.com/",
    leavePage:
      "https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave",
    leaveList:
      "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewMyLeaveList",
  };
  const userCredential: UserCredential = {
    Username: "Admin",
    Password: "admin123",
  };
  const leaveRequestInfo: LeaveRequestInfo = {
    leaveType: "CAN - Personal",
    fromDate: "2024-11-20",
    toDate: "2024-11-21",
  };
  //edge case
  const invalidLeaveRequestInfo: LeaveRequestInfo = {
    leaveType: "CAN - Personal",
    fromDate: "2024-11-20",
    toDate: "2024-11-10",
  };
  //nefative case
  const leaveRequestInfoLargerThanBalance: LeaveRequestInfo = {
    leaveType: "CAN - Personal",
    fromDate: "2024-11-20",
    toDate: "2024-12-10",
  };

  //login
  test.beforeEach(async ({ page }) => {
    hrSystem = new HRsystem(page);

    await page.goto(URLs.loginPage, { waitUntil: "load" });
    //login with info
    await hrSystem.loginWithUserInfo(userCredential);
  });

  //happy path
  test("should apply lease successfully", async ({ page }) => {
    //step: go to leave page
    await test.step("go to leave page", async () => {
      await page.goto(URLs.leavePage, { waitUntil: "load" });
    });
    //step: apply leave
    await test.step("apply leave", async () => {
      await hrSystem.fillLeaveRequest(leaveRequestInfo);
    });

    //step: verify the leave applied
    await test.step("verify the leave applied", async () => {
      await page.goto(URLs.leaveList, { waitUntil: "load" });
      const leaveSuccessMessageLocator =
        await hrSystem.getLeaveSuccessMessage(leaveRequestInfo);
      await expect(leaveSuccessMessageLocator.record).toBeVisible();
    });
  });

  //edge case

  test("should fail with invalid input", async ({ page }) => {
    //step: go to leave page
    await test.step("go to leave page", async () => {
      await page.goto(URLs.leavePage, { waitUntil: "load" });
    });
    //step: apply leave
    await test.step("apply leave", async () => {
      await hrSystem.fillLeaveRequest(invalidLeaveRequestInfo);
    });
    //step: verify the leave refuse
    await test.step("verify the leave applied", async () => {
      await page.goto(URLs.leaveList, { waitUntil: "load" });
      const leaveSuccessMessageLocator =
        await hrSystem.getLeaveSuccessMessage(invalidLeaveRequestInfo);
      await expect(leaveSuccessMessageLocator.record).toBeHidden();
    });
  });

  //   //negative case 17:08
  test("should fail when leave balance is used up", async ({ page }) => {
    //step: go to leave page
    await test.step("go to leave page", async () => {
      await page.goto(URLs.leavePage, { waitUntil: "load" });
    });
    //step: apply leave
    await test.step("apply leave", async () => {
      await hrSystem.fillLeaveRequest(leaveRequestInfoLargerThanBalance);
    });
    //step: verify the leave refuse
    await test.step("verify the leave applied", async () => {
      await page.goto(URLs.leaveList, { waitUntil: "load" });
      const leaveSuccessMessageLocator =
        await hrSystem.getLeaveSuccessMessage(
          leaveRequestInfoLargerThanBalance
        );
      await expect(leaveSuccessMessageLocator.record).toBeHidden();
    });
  });
});
//17:15
