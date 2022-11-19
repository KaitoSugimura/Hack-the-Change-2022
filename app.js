import { firebase } from "./firebase.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, Timestamp, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const signInOutBtn = document.querySelector(".sign-in-out");
const userEl = document.querySelector(".user");

const auth = getAuth();
const provider = new GoogleAuthProvider();

const db = getFirestore(firebase);

signInOutBtn.onclick = () => {
  if (!auth.currentUser) {
    signInWithPopup(auth, provider);
  }
  else {
    signOut(auth);
  }
}

// Handle login/logout logic
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("logged in");
    signInOutBtn.innerHTML = "Sign out"
    userEl.innerHTML = `
    <h3>Hello, ${user.displayName}.</h3> 
    <img src="${user.photoURL}" alt="User Profile Picture">
    `;
  } else {
    console.log("logged out");
    signInOutBtn.innerHTML = "Sign in"
    userEl.innerHTML = "";
  }
})

// Retrieve user data
auth.onAuthStateChanged(async user => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("user found");
      newUser(user);
    } else {
      console.log("user not found, added");
      newUser(user);
    }
  } else {
  }
})

async function newUser(user) {
  await setDoc(doc(db, "users", user.uid), {
    avatar: "avatar stuff here",
    pets: [
      "dog",
      "cat",
    ],
  });
}