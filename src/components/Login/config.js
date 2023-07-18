import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmhj05RG6yIqkzsFt4qKL3DmWocua8zCY",
  authDomain: "react-auth-bc0a4.firebaseapp.com",
  projectId: "react-auth-bc0a4",
  storageBucket: "react-auth-bc0a4.appspot.com",
  messagingSenderId: "666306216389",
  appId: "1:666306216389:web:bf4629e5dd0ca84f9d0bac",
  measurementId: "G-RZK7PNNJJR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};