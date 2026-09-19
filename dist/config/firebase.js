"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const admin = __importStar(require("firebase-admin"));
const env_js_1 = require("./env.js");
let firestoreInstance = null;
try {
    if (env_js_1.ENV.FIREBASE_PRIVATE_KEY && env_js_1.ENV.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env_js_1.ENV.FIREBASE_PROJECT_ID,
                clientEmail: env_js_1.ENV.FIREBASE_CLIENT_EMAIL,
                privateKey: env_js_1.ENV.FIREBASE_PRIVATE_KEY,
            }),
        });
        firestoreInstance = admin.firestore();
        console.log('[Firebase] Successfully connected to Firebase Admin SDK & Firestore database.');
    }
    else {
        console.log('[Firebase] Private key/client email missing in env. Initializing Firestore in-memory fallback adapter.');
        firestoreInstance = createInMemoryFirestore();
    }
}
catch (err) {
    console.warn('[Firebase] Warning initializing Firebase Admin:', err);
    firestoreInstance = createInMemoryFirestore();
}
exports.db = firestoreInstance;
/**
 * Robust in-memory Firestore emulator for zero-config offline execution & unit tests.
 */
function createInMemoryFirestore() {
    const store = {};
    return {
        collection(collectionName) {
            if (!store[collectionName]) {
                store[collectionName] = {};
            }
            return {
                doc(docId) {
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
                        async set(data, options) {
                            if (options?.merge && store[collectionName][id]) {
                                store[collectionName][id] = { ...store[collectionName][id], ...data };
                            }
                            else {
                                store[collectionName][id] = { ...data, id };
                            }
                            return { id };
                        },
                        async update(data) {
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
                async add(data) {
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
                where(field, op, value) {
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
    function createQuery(collectionName, filters) {
        return {
            where(field, op, value) {
                filters.push({ field, op, value });
                return createQuery(collectionName, filters);
            },
            async get() {
                let items = Object.values(store[collectionName] || {});
                for (const f of filters) {
                    items = items.filter((item) => {
                        const val = item[f.field];
                        if (f.op === '==')
                            return val === f.value;
                        if (f.op === '!=')
                            return val !== f.value;
                        if (f.op === 'array-contains')
                            return Array.isArray(val) && val.includes(f.value);
                        if (f.op === 'in')
                            return Array.isArray(f.value) && f.value.includes(val);
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
