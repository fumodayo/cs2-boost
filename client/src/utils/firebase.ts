// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cs2-boost.firebaseapp.com",
  projectId: "cs2-boost",
  storageBucket: "cs2-boost.appspot.com",
  messagingSenderId: "511160180488",
  appId: "1:511160180488:web:a5ab7c7bbff5e0071296bd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
