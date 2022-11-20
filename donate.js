import { firebase } from "./firebase.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const NoDonationsFound = document.querySelector(".No-donations-found");
const loading = document.querySelector(".loading-message");

// Auth
const auth = getAuth();

const db = getFirestore(firebase);

populateCharities("");

const searchEl = document.querySelector(".search-button");
searchEl.onclick = () => {
  const searchTerm = document.querySelector(".search-input").value;
  populateCharities(searchTerm);
};

async function populateCharities(searchTerm) {
  const charitiesEl = document.querySelector(".charities");
  charitiesEl.innerHTML = "";

  const charities = await getCharities(searchTerm);
  const charitiesContent = charities.map(
    (charity) => `
    <div class="charity-container">
      <div class="charity-info">
        <span class="charity-title">${charity.name}</span>
        <p class="charity-description">${charity.tagLine ?? "[No description]"
      }</p >
        <div class="charity-payment">
        <button class="charity-addToCart" type="button">Donate</button>
        <input class="charity-amount" type="number" name="" id="">
        </div>
      </div>
    </div>`
  );
  charitiesEl.innerHTML = charitiesContent.join("");

  let i = 0;
  for (const child of charitiesEl.children) {
    const button = child.querySelector(".charity-addToCart");

    button.onclick = () => {
      const amount = child.querySelector(".charity-amount").value;
      console.log(amount);
      if (amount > 0) {
        donate(charities[i].ein, auth.currentUser.uid, Number(amount), charities[i++].name);
      }
      child.querySelector(".charity-amount").value = null;
    };
  }
}

// Returns an array of info for the top 5 charities relevant to searchTerm
export async function getCharities(searchTerm) {
  NoDonationsFound.classList.remove("Display-NMF");
  loading.classList.add("Display-NMF");
  console.log(`search for ${searchTerm?.replace(/ /g, "%20")}`);

  const response = await fetch(
    `https://api.data.charitynavigator.org/v2/Organizations?app_id=82ee3118&app_key=9299ff0993ecbf62a5a18c8c4e8ae23c&pageSize=30&rated=true&search=${searchTerm?.replace(/ /g, "%20") ?? ""
    }&searchType=NAME_ONLY`
  );
  const json = await response.json();

  var charities;

  if (json.errorMessage) {
    console.log("ERROR");
    NoDonationsFound.classList.add("Display-NMF");
  } else {
    charities = await Promise.all(
      json.map(async (charity) => ({
        name: charity.charityName,
        tagLine: charity.tagLine,
        url: charity.charityNavigatorURL,
        ein: charity.ein,
        // score: charity.currentRating.score,
        comments: await getCharityComments(charity.ein, charity.charityName),
      }))
    );
  }


  loading.classList.remove("Display-NMF");

  return charities;
}

// Returns array of comments for charity with given ein
export async function getCharityComments(ein, charityName) {
  const charityRef = doc(db, "charities", ein);
  const docSnap = await getDoc(charityRef);

  if (!docSnap.exists()) {
    await setDoc(charityRef, {
      name: charityName,
      comments: [`Thank you, all who donated to ${charityName}!`],
      subscribers: ["lVIel1RoXVdkXuf6ersIj9WGhZf2"],
    });
  }

  return docSnap.data().comments;
}

// Register a donator to the charity with given ein
export async function donate(ein, donator, amount, charityName) {
  console.log(`subscribing ${donator} to ${charityName} with the amount ${amount}`);
  const charityRef = doc(db, "charities", ein);
  const qSnap = await getDoc(charityRef);

  const subscribers = qSnap.data().subscribers;
  if (!subscribers.includes(donator)) {
    subscribers.push(donator);
    await setDoc(
      charityRef,
      {
        subscribers: subscribers,
      },
      { merge: true }
    );
  }


  const userRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(userRef);

  const donationHistory = docSnap.data().donationHistory;
  donationHistory.push({
    name: charityName,
    amount: amount,
  })

  await setDoc(userRef, {
    donationHistory: donationHistory,
    donationTotal: docSnap.data().donationTotal += amount,
  }, { merge: true });
}

// console.log(await getCharities("children"));
// addDonator("311811917", "lVIel1RoXVdkXuf6ersIj9WGhZf2");
