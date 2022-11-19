import { firebase } from "./firebase.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, Timestamp, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const db = getFirestore(firebase);

// Returns an array of info for the top 5 charities relevant to searchTerm
export async function getCharities(searchTerm) {
  const response = await fetch(`https://api.data.charitynavigator.org/v2/Organizations?app_id=82ee3118&app_key=9299ff0993ecbf62a5a18c8c4e8ae23c&pageSize=5&rated=true&sort=RATING%3ADESC&&search=${searchTerm ?? ''}`)
  const json = await response.json();
  // console.log(json);

  const charities = await Promise.all(json.map(async charity => ({
    name: charity.charityName,
    tagLine: charity.tagLine,
    url: charity.charityNavigatorURL,
    score: charity.currentRating.score,
    comments: await getCharityComments(charity.ein),
  })));
  console.log(charities);

  return charities;
}

// Returns array of comments for charity with given ein
async function getCharityComments(ein) {
  const charityRef = doc(db, "charities", ein);
  const docSnap = await getDoc(charityRef);

  if (docSnap.exists()) {
  } else {
    await setDoc(charityRef, {
      comments: [
        "COMMENT UNO",
      ]
    });
  }
  return docSnap.data().comments;
}

getCharities("children");