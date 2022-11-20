import { firebase } from "./firebase.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, getDocs, Timestamp, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

// DOM references
const signInOutBtn = document.querySelector(".sign-in-out");

// Auth
const auth = getAuth();
const provider = new GoogleAuthProvider();

// DB
const db = getFirestore(firebase);

// Logic for sign in/out button
signInOutBtn.onclick = () => {
  if (!auth.currentUser) {
    signInWithPopup(auth, provider);
  }
  else {
    signOut(auth);
  }
}

// Handle login/logout logic
auth.onAuthStateChanged(async user => {
  if (user) {
    console.log("logged in");
    signInOutBtn.innerHTML = "Sign out"
    signInOutBtn.style.backgroundColor = "#d6336c";
    console.log(await getUserData(user));
  } else {
    console.log("logged out");
    signInOutBtn.innerHTML = "Sign in"
    signInOutBtn.style.backgroundColor = "#9775fa";
  }
})

// Add user to databse if new
auth.onAuthStateChanged(async user => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("user found");
    } else {
      console.log("user not found, added");
      newUser(user);
    }
  }
})

// Creates databse entry for new user
export async function newUser(user) {
  await setDoc(doc(db, "users", user.uid), {
    capybaras: 1,
    pandas: 2,
    favoriteCharity: "UNICEF",
    tier: "panda",
    donationHistory: [],
    donationTotal: 354.00,
  });
}

// Returns pets owned by user
export async function getPets(user) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("couldn't get pets - user doesn't exist in database!");
  }
}

// Returns up to n thank-yous for user
export async function getThankYou(user, n) {
  const qSnap = await getCharitiesDonatedTo(user);

  let thankYous = [];
  qSnap.forEach(charity => {
    const comments = charity.data().comments;
    if (comments.length > 0) {
      thankYous.push(charity.data().comments[0]);
    }
  })

  return thankYous.slice(0, n);
}

// Returns up to n personal thank-yous for user
export async function getPersonalThankYous(user, n) {
  const thankYousRef = collection(db, "personalThankYous");
  const q = query(thankYousRef, where("to", "==", user.uid));
  const qSnap = await getDocs(thankYousRef);

  const thankYous = [];
  qSnap.forEach(thankYou => {
    thankYous.push(thankYou.data());
  })

  return thankYous.slice(0, n);
}

// Returns charities that user donated to
export async function getCharitiesDonatedTo(user) {
  const charitiesRef = collection(db, "charities");
  const q = query(charitiesRef, where("subscribers", "array-contains", user.uid));
  const qSnap = await getDocs(q);
  return qSnap;
}

// Returns user information
export async function getUserData(user) {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    let data = {}
    if (docSnap.exists()) {
      data = docSnap.data();
    }
    data.name = user.displayName;
    data.email = user.email;
    data.photo = user.photoURL;

    return data;
  }
}