import { getCurrentUser, getUserData, getCharitiesDonatedTo } from "./app.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
const auth = getAuth();

const NAME = document.getElementById("NAME");
const EMAIL = document.getElementById("EMAIL");
const HISTORY = document.querySelector(".donate");

auth.onAuthStateChanged(async user => {
  if (user) {
    const userData = await getUserData(user);
    NAME.innerHTML = userData.name;
    EMAIL.innerHTML = userData.email;

    HISTORY.innerHTML = userData.donationHistory.map(donation => `
      <li>
        $<span class="donation-amount">${donation.amount}</span> -
        <span class="donation-name">${donation.name}</span>
      </li>
    `).join('');
  } else {
    NAME.innerHTML = '';
    EMAIL.innerHTML = '';
  }
})
// HISTORY.innerHTML = getCharitiesDonatedTo(auth.currentUser);

const userDonations = await getCharitiesDonatedTo(getCurrentUser());
HISTORY.innerHTML = userDonations.map(
  (data) => `
    <li>$<span class="donation-amount">${data.total}</span> - <span class="donation-name">${data.history}</span></li>`
).join("");

// console.log(async getCharitiesDonatedTo(auth.currentUser));
