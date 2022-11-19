import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js"

const firebaseConfig = {
  apiKey: "AIzaSyBmRF40lBocjTVnJqy2zHancwJVxmrv3oo",
  authDomain: "something-unique-8ad59.firebaseapp.com",
  projectId: "something-unique-8ad59",
  storageBucket: "something-unique-8ad59.appspot.com",
  messagingSenderId: "1065463832446",
  appId: "1:1065463832446:web:a59f8ece82b778273b1d2f"
};

export const firebase = initializeApp(firebaseConfig);