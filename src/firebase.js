import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBLP0n19AlhHLnOxhF-mY9fCPUDVbD-85w",
  authDomain: "chat-3edc8.firebaseapp.com",
  projectId: "chat-3edc8",
  storageBucket: "chat-3edc8.appspot.com",
  messagingSenderId: "677250350464",
  appId: "1:677250350464:web:0d703eeac50efac6f45565",
  measurementId: "G-6RCCZH48GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
