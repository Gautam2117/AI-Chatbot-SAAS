// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVXAJkMAxmsAGzgBIV5h2ATfsfpTlSA8w",
  authDomain: "ai-chatbot-saas-71e68.firebaseapp.com",
  projectId: "ai-chatbot-saas-71e68",
  storageBucket: "ai-chatbot-saas-71e68.firebasestorage.app",
  messagingSenderId: "901084485654",
  appId: "1:901084485654:web:0a3d1b47d6c5c9c6ea3d37",
  measurementId: "G-SFCQ172Z95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
