import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import dotenv from 'dotenv';
import path from 'path';

// This will attempt to load environment variables from .env.local
// This is especially useful for ensuring server-side actions have the correct environment
if (typeof window === 'undefined') { // Only run on server
  try {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  } catch(e) {
    // It's okay if this fails, Next.js might have already loaded it.
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | undefined;

// We check if the project ID is provided. If not, Firebase initialization will fail.
// This is a common issue when the .env.local file is not set up correctly.
if (firebaseConfig.projectId) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (e) {
    console.error(
      "Firebase initialization error. Please ensure your .env.local file is configured correctly.",
      e
    );
  }
} else {
  // This message is more explicit about the cause
  console.error("Firebase project ID not found in environment variables. Please check your .env.local file and restart the server.");
}

export { db };
