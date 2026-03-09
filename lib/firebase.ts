import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseEnv = {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  EXPO_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const missingFirebaseEnvKeys = Object.entries(firebaseEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isWebAppId = firebaseEnv.EXPO_PUBLIC_FIREBASE_APP_ID.includes(':web:');
export const firebaseConfigWarnings: string[] = [];

if (!isWebAppId && firebaseEnv.EXPO_PUBLIC_FIREBASE_APP_ID) {
  firebaseConfigWarnings.push(
    'EXPO_PUBLIC_FIREBASE_APP_ID는 iOS 앱 ID가 아니라 웹 앱 ID(:web:)를 사용해야 합니다.',
  );
}

export const isFirebaseConfigured =
  missingFirebaseEnvKeys.length === 0 && firebaseConfigWarnings.length === 0;

const firebaseConfig = {
  apiKey: firebaseEnv.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: firebaseEnv.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: firebaseEnv.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseEnv.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export { firebaseApp };
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
