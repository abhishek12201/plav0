
import { initializeApp, getApp, getApps, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { firebaseConfig } from "./config";

function getFirebaseApp(options: FirebaseOptions) {
  return !getApps().length ? initializeApp(options) : getApp();
}

export function getSdks() {
  const firebaseApp = getFirebaseApp(firebaseConfig);
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    functions: getFunctions(firebaseApp)
  };
}
