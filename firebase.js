import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";
import {
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfWgxWnvB9Et4mO3Wrd7Ep9H59n5JFjxk",
  authDomain: "wdig-d9431.firebaseapp.com",
  projectId: "wdig-d9431",
  storageBucket: "wdig-d9431.firebasestorage.app",
  messagingSenderId: "1001960480504",
  appId: "1:1001960480504:web:7e51107fcddf3443ece50d",
  measurementId: "G-MS5ZFVXCWL",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};