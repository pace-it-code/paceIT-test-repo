// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSTXVPDmujXjxFdmcJ51LX9Pv75kJOUA0",
  authDomain: "paceit-4cf65.firebaseapp.com",
  projectId: "paceit-4cf65",
  storageBucket: "paceit-4cf65.firebasestorage.app",
  messagingSenderId: "33321994654",
  appId: "1:33321994654:web:414d3a786b2ed830602e8f",
  measurementId: "G-P91C5HPWFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);