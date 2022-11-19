import { firebase } from "./firebase.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, Timestamp, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const signInOutBtn = document.querySelector(".sign-in-out");
const userEl = document.querySelector(".user");

const auth = getAuth();
const provider = new GoogleAuthProvider();

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
    signInOutBtn.innerHTML = "Sign Out"
    userEl.innerHTML = `
    <h3>Hello, ${user.displayName}.</h3> 
    <img src="${user.photoURL}" alt="User Profile Picture">
    `;
  } else {
    console.log("logged out");
    signInOutBtn.innerHTML = "Sign In"
    userEl.innerHTML = "";
  }
})

// Retrieve 
auth.onAuthStateChanged(async user => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("user found");
    } else {
      console.log("user not found, added");
      await setDoc(doc(db, "users", user.uid), {
        avatar: "placeholder",
      });
    }
  } else {
  }
})

const db = getFirestore(firebase);

auth.onAuthStateChanged(user => {
  if (user) {
    // thingsRef = collection(db, 'things');

    // createThing.onclick = () => {
    //   addDoc(thingsRef, {
    //     uid: user.uid,
    //     name: faker.commerce.productName(),
    //     createdAt: Timestamp.now(),
    //   });
    // }

    // const q = query(thingsRef, where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    // unsubscribe = onSnapshot(q, querySnapshot => {
    //   const items = querySnapshot.docs.map(doc => {
    //     return `<li>${doc.data().name}</li>`
    //   });

    //   thingsList.innerHTML = items.join('');
    // })

  } else {
    // unsubscribe && unsubscribe();
  }
})