import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfWgxWnvB9Et4mO3Wrd7Ep9H59n5JFjxk",
  authDomain: "wdig-d9431.firebaseapp.com",
  projectId: "wdig-d9431",
  storageBucket: "wdig-d9431.firebasestorage.app",
  messagingSenderId: "1001960480504",
  appId: "1:1001960480504:web:7e51107fcddf3443ece50d",
  measurementId: "G-MS5ZFVXCWL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};