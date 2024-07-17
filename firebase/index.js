// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBPKY3_iAtVvTROtmyJwWk_5YV8B1-5IE",
  authDomain: "shopping-app-8a824.firebaseapp.com",
  projectId: "shopping-app-8a824",
  storageBucket: "shopping-app-8a824.appspot.com",
  messagingSenderId: "581789369588",
  appId: "1:581789369588:web:0cf2b8efe1747972b8caa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { app, db, getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc };
