import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration for the EcoTrack platform.
 * Initializes Analytics, Authentication, and Firestore services.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyEcoTrack7f805ProjectKeyHere",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecotrack-7f805.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecotrack-7f805",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecotrack-7f805.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdefecotrack7f805",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ECOTRACK7F805"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Conditionally initializes Firebase Analytics.
 * Returns null if the environment does not support analytics.
 * @returns {Promise<Analytics|null>}
 */
export const initAnalytics = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
  return null;
};
