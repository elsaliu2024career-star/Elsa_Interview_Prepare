import { test, expect } from "@playwright/test";
import { BnbHomePage } from "../pages/airbnb-home-page";
import { RoomPage } from "../pages/airbng-detail-page";

//9:33
test.describe('test the airbnb app', ()=>{
  //test data
  const bnbURL = 'https://automationintesting.online/';

  //happy path
  test('should book the room successully with user info', async({page})=>{
    //intialization
    const bnbHomePage = new BnbHomePage(page);
    const roomRange = new RoomPage(page);

    const availability = {
      checkIn: '17/11/2025',
      checkOut: '18/11/2025',
    }
    const expectedRoomInfo ={
      firstRoomPrice: 100,
      timeRange: '£100 x 1 nights',
      successMessage: 'Booking Confirmed'
    };
    const buttons = ['firstRoomBookButton','reserve','confirm'];
    let firstRoomPrice;
    const userInfo = {
      formFirstName: 'elsa',
      formLastName: 'tesiu',
      email: 'elsa.tt@sina.com',
      phone: '04410997825',
    }

    // step: home page, book your stay
    await test.step('access to home page and fill the availability', async()=>{
      await bnbHomePage.navigateToHomePage(bnbURL);

      //fill in date

      await bnbHomePage.fillDate(availability.checkIn, "checkIn");
      await bnbHomePage.fillDate(availability.checkOut, "checkOut");
      //get the 1st room price for later verification
      firstRoomPrice = await bnbHomePage.getContent('firstRoomPrice');
      // book now, go to detail page;
      await bnbHomePage.clickBotton('firstRoomBookButton');    
    });

    //step: choose a room
    await test.step('verify the room info and proceed to book', async()=>{
      const roomInfo = await roomRange.getContent('timeRange'); 
      expect(roomInfo.trim()).toBe(expectedRoomInfo.timeRange);
    });

    await roomRange.clickBotton('reserve');
    //step: fill information and confirm

    for(const [item, content] of Object.entries(userInfo)){
      await test.step(`adding the ${content} to ${item}`, async()=>{
        await roomRange.fillInfo(item, content);
      });
    };

    //step: confirm verify success message
    await test.step('confirm the booking and verify success', async()=>{
      await roomRange.clickBotton('confirm');
      const message = await roomRange.getContent('successMessage');
      console.log(`the final message is ${message}`);
      expect(message).toContain(expectedRoomInfo.successMessage);
    })
  });
  //11:4
});


//13:16

test('test the airBnb app', async()=>{

    //initialization/ test dat

    //step: navigate to the homepage and fill in the data

    //step: select one room and fill in user info

    //step: check out and verify success message
});