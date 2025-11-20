// shopping app test data
export const homePagURL = "https://www.demoblaze.com/index.html";
export const cartPageURL = "https://www.demoblaze.com/cart.html";
export const homePageExpectedValueMap = {
  heading: "PRODUCT STORE",
  samsungLink: "Samsung galaxy s6",
  samsungPrice: "360",
};
export let quantityExpected: number = 3;
export const totalPriceExpected = 360 * quantityExpected;
export const orderContent = {
  Name: "elsa",
  Country: "CHN",
  City: "MEL",
  Card: "3333",
  Month: "12",
  Year: "1988",
};
export const orderSuccessMessage = "Thank you for your purchase";
