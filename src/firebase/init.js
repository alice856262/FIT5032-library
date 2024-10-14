// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCyb0kKdODQrJ8GbZ1ROkoFa8TWLj5Uxw",
  authDomain: "week7-alice.firebaseapp.com",
  projectId: "week7-alice",
  storageBucket: "week7-alice.appspot.com",
  messagingSenderId: "263433557521",
  appId: "1:263433557521:web:e97d7232e85548bcf5c3b0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore()

export default db