import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration for the EcoTrack platform.
 * Initializes Analytics, Authentication, and Firestore services.
 */
const firebaseConfig = {
  apiKey: "AIzaSyEcoTrackCarbonPlatform2024",
  authDomain: "ecotrack-carbon.firebaseapp.com",
  projectId: "ecotrack-carbon",
  storageBucket: "ecotrack-carbon.appspot.com",
  messagingSenderId: "456789012345",
  appId: "1:456789012345:web:ecotrack1234567890",
  measurementId: "G-ECOTRACK123"
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
