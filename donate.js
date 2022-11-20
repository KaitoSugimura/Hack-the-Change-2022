import { firebase } from "./firebase.js";
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, Timestamp, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

const db = getFirestore(firebase);
const charitiesEl = document.querySelector(".charities");

const charities = await getCharities("children");
console.log(charities);
const charitiesContent = charities.map(charity => `
    <div class="charity-container">
      <div class="charity-imageContainer">
        <img class="charity-image" src="image" alt="" />
      </div>
      <div class="charity-info">
        <span class="charity-title">${charity.name}</span>
        <p class="charity-description">${charity.tagLine}</p>
        <span class="charity-price">Choose a donation amount</span>
        <button class="charity-addToCart" type="button" onClick={onClick}>Donate</button>
      </div>
    </div>
`)
charitiesEl.innerHTML = charitiesContent.join('');


// Returns an array of info for the top 5 charities relevant to searchTerm
export async function getCharities(searchTerm) {
  const response = await fetch(`https://api.data.charitynavigator.org/v2/Organizations?app_id=82ee3118&app_key=9299ff0993ecbf62a5a18c8c4e8ae23c&pageSize=5&rated=true&sort=RATING%3ADESC&&search=${searchTerm?.replace(/ /g, "%20") ?? ''}`)
  const json = await response.json();

  const charities = await Promise.all(json.map(async charity => ({
    name: charity.charityName,
    tagLine: charity.tagLine,
    url: charity.charityNavigatorURL,
    score: charity.currentRating.score,
    comments: await getCharityComments(charity.ein, charity.charityName),
  })));

  return charities;
}

// Returns array of comments for charity with given ein
export async function getCharityComments(ein, charityName) {
  const charityRef = doc(db, "charities", ein);
  const docSnap = await getDoc(charityRef);

  if (!docSnap.exists()) {
    await setDoc(charityRef, {
      name: charityName,
      comments: [
        `Thank you, all who donated to ${charityName}!`,
      ],
      subscribers: [
        "lVIel1RoXVdkXuf6ersIj9WGhZf2",
      ],
    });
  }

  return docSnap.data().comments;
}

// Register a donator to the charity with given ein
export async function addDonator(ein, donator) {
  const charityRef = doc(db, "charities", ein);
  const qSnap = await getDoc(charityRef);

  const subscribers = qSnap.data().subscribers;
  if (!subscribers.includes(donator)) {
    subscribers.push(donator);
    console.log(subscribers);
    await setDoc(charityRef, {
      subscribers: subscribers,
    }, { merge: true });
  }
}

// console.log(await getCharities("children"));
// addDonator("311811917", "lVIel1RoXVdkXuf6ersIj9WGhZf2");
