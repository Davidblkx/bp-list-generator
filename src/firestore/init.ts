import { credential, initializeApp, ServiceAccount } from 'firebase-admin';

import { BPDatabase } from './bp-database';

export function initFirestoreDatabase(serviceAccount: ServiceAccount) {

  const app = initializeApp({
    credential: credential.cert(serviceAccount)
  });

  const db =  app.firestore();
  db.settings({ timestampsInSnapshots: true });
  return db;
}

export function initBPDatabaseInstance(serviceAccount: ServiceAccount) {
  return new BPDatabase(initFirestoreDatabase(serviceAccount));
}
