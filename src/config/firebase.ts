import * as admin from 'firebase-admin';
import { ENV } from './env';

let firestoreInstance: any = null;

try {
  if (ENV.FIREBASE_PRIVATE_KEY && ENV.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: ENV.FIREBASE_PROJECT_ID,
        clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
        privateKey: ENV.FIREBASE_PRIVATE_KEY,
      }),
    });
    firestoreInstance = admin.firestore();
    console.log('[Firebase] Successfully connected to Firebase Admin SDK & Firestore database.');
  } else {
    console.log('[Firebase] Private key/client email missing in env. Initializing Firestore in-memory fallback adapter.');
    firestoreInstance = createInMemoryFirestore();
  }
} catch (err) {
  console.warn('[Firebase] Warning initializing Firebase Admin:', err);
  firestoreInstance = createInMemoryFirestore();
}

export const db = firestoreInstance;

/**
 * Robust in-memory Firestore emulator for zero-config offline execution & unit tests.
 */
function createInMemoryFirestore() {
  const store: Record<string, Record<string, any>> = {};

  return {
    collection(collectionName: string) {
      if (!store[collectionName]) {
        store[collectionName] = {};
      }

      return {
        doc(docId?: string) {
          const id = docId || 'doc_' + Math.random().toString(36).substring(2, 9);
          return {
            id,
            async get() {
              const data = store[collectionName][id];
              return {
                exists: !!data,
                id,
                data: () => (data ? { ...data } : undefined),
              };
            },
            async set(data: any, options?: { merge?: boolean }) {
              if (options?.merge && store[collectionName][id]) {
                store[collectionName][id] = { ...store[collectionName][id], ...data };
              } else {
                store[collectionName][id] = { ...data, id };
              }
              return { id };
            },
            async update(data: any) {
              if (!store[collectionName][id]) {
                throw new Error(`Document ${id} in ${collectionName} does not exist.`);
              }
              store[collectionName][id] = { ...store[collectionName][id], ...data };
              return { id };
            },
            async delete() {
              delete store[collectionName][id];
              return true;
            },
          };
        },
        async add(data: any) {
          const id = 'doc_' + Math.random().toString(36).substring(2, 9);
          store[collectionName][id] = { ...data, id };
          return {
            id,
            async get() {
              return {
                exists: true,
                id,
                data: () => ({ ...store[collectionName][id] }),
              };
            },
          };
        },
        where(field: string, op: string, value: any) {
          return createQuery(collectionName, [{ field, op, value }]);
        },
        async get() {
          const docs = Object.values(store[collectionName] || {}).map((item) => ({
            id: item.id,
            exists: true,
            data: () => ({ ...item }),
          }));
          return {
            empty: docs.length === 0,
            docs,
            size: docs.length,
          };
        },
      };
    },
  };

  function createQuery(collectionName: string, filters: Array<{ field: string; op: string; value: any }>) {
    return {
      where(field: string, op: string, value: any) {
        filters.push({ field, op, value });
        return createQuery(collectionName, filters);
      },
      async get() {
        let items = Object.values(store[collectionName] || {});
        for (const f of filters) {
          items = items.filter((item) => {
            const val = item[f.field];
            if (f.op === '==') return val === f.value;
            if (f.op === '!=') return val !== f.value;
            if (f.op === 'array-contains') return Array.isArray(val) && val.includes(f.value);
            if (f.op === 'in') return Array.isArray(f.value) && f.value.includes(val);
            return true;
          });
        }
        const docs = items.map((item) => ({
          id: item.id,
          exists: true,
          data: () => ({ ...item }),
        }));
        return {
          empty: docs.length === 0,
          docs,
          size: docs.length,
        };
      },
    };
  }
}
