import { readFileSync } from 'node:fs';
import path from 'node:path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { backendDirectory } from './env.js';

const serviceAccountPath = path.resolve(
  backendDirectory,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
    './secrets/serviceAccount.json',
);

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  throw new Error(
    `Não foi possível carregar a conta de serviço do Firebase em ${serviceAccountPath}. Confira FIREBASE_SERVICE_ACCOUNT_PATH.`,
    { cause: error },
  );
}

const firebaseApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
  });

export const database = getFirestore(firebaseApp);
