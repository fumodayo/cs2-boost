import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cs2-boost.firebaseapp.com",
  projectId: "cs2-boost",
  storageBucket: "cs2-boost.appspot.com",
  messagingSenderId: "511160180488",
  appId: "1:511160180488:web:a5ab7c7bbff5e0071296bd",
};
export const app = initializeApp(firebaseConfig);
