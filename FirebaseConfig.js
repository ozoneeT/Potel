// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0BSgi4wnpvPUr1XIDjeuyqO2dpdplpAI",
  authDomain: "potel-e4fc2.firebaseapp.com",
  projectId: "potel-e4fc2",
  storageBucket: "potel-e4fc2.appspot.com",
  messagingSenderId: "218635745297",
  appId: "1:218635745297:web:7bb926acab01974461d9b0",
  measurementId: "G-DR754JR9WN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
