// src/firebase.js
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBVXAJkMAxmsAGzgBIV5h2ATfsfpTlSA8w",
  authDomain: "ai-chatbot-saas-71e68.firebaseapp.com",
  projectId: "ai-chatbot-saas-71e68",
  storageBucket: "ai-chatbot-saas-71e68.firebasestorage.app",
  messagingSenderId: "901084485654",
  appId: "1:901084485654:web:0a3d1b47d6c5c9c6ea3d37",
  measurementId: "G-SFCQ172Z95",
};

export const app = initializeApp(firebaseConfig);

/** 🔐 App Check FIRST (before other Firebase services) */
if (import.meta.env.DEV) {
  // one-time: console will print a token; add it in Console → App Check → Apps → Add debug token
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;
if (!siteKey) {
  console.warn("VITE_RECAPTCHA_V3_SITE_KEY is missing; App Check will be disabled.");
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

/** now initialize the rest */
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

let analytics = null;
if (typeof window !== "undefined") {
  analyticsSupported().then((ok) => { if (ok) analytics = getAnalytics(app); });
}
