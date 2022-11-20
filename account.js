import { getCurrentUser, getUserData, getCharitiesDonatedTo } from "./app.js";

const NAME = document.getElementById("NAME");
const EMAIL = document.getElementById("EMAIL");
const HISTORY = document.getElementById("HISTORY");

const userData = await getUserData(getCurrentUser());
NAME.innerHTML = userData.name;
EMAIL.innerHTML = userData.email;

const userDonations = await getCharitiesDonatedTo(getCurrentUser());
HISTORY.innerHTML = userDonations.map(
  (data) => `
    <li>$<span class="donation-amount">${data.total}</span> - <span class="donation-name">${data.history}</span></li>`
).join("");

// console.log(async getCharitiesDonatedTo(auth.currentUser));
