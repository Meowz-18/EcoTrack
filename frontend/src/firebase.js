import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration for the EcoTrack platform.
 * Initializes Analytics, Authentication, and Firestore services.
 *
 * @security These API keys are client-side Firebase keys, which are
 * public by design (they identify the project, not authenticate it).
 * Access control is enforced by Firebase Security Rules on the backend,
 * not by key secrecy. Env-var overrides are provided for CI/CD flexibility.
 * @see https://firebase.google.com/docs/projects/api-keys
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDiDQmXHgvacPLzXkDn2UU3PmOijGCO980",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecotrack-7f805.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecotrack-7f805",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecotrack-7f805.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "866853150264",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:866853150264:web:5d08d19925a6b65606d0cd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CX6E6P3L2W"
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
