import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import {
    CACHE_SIZE_UNLIMITED,
    getFirestore,
    initializeFirestore,
    type Firestore,
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export type FirebaseBundle = {
    app: FirebaseApp;
    db: Firestore;
    storage: FirebaseStorage;
    auth: Auth;
};

let bundle: FirebaseBundle | undefined;
let overrideOptions: FirebaseOptions | undefined;

/** Liest die Standard-Env-Variablen, die jedes site-manager-Projekt setzt. */
export const firebaseOptionsFromEnv = (): FirebaseOptions => ({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

/** True, wenn genug Env gesetzt ist, um Firebase überhaupt zu initialisieren. */
export const hasFirebaseConfig = (): boolean => {
    const options = overrideOptions ?? firebaseOptionsFromEnv();
    return Boolean(options.apiKey && options.projectId);
};

/**
 * Firebase explizit konfigurieren, statt über Env. Muss vor dem ersten
 * `getFirebase()` aufgerufen werden.
 */
export const configureFirebase = (options: FirebaseOptions) => {
    overrideOptions = options;
    bundle = undefined;
};

/**
 * Initialisiert Firebase beim ERSTEN Aufruf — nicht beim Import. Dadurch
 * lassen sich Komponenten aus diesem Paket auch in Apps ohne Firebase-Env
 * importieren, solange sie die Firebase-Pfade nicht anfassen.
 */
export const getFirebase = (): FirebaseBundle => {
    if (bundle) return bundle;

    const options = overrideOptions ?? firebaseOptionsFromEnv();

    if (!options.apiKey || !options.projectId) {
        throw new Error(
            "[@site/globals] Firebase ist nicht konfiguriert. Setze die " +
                "NEXT_PUBLIC_FIREBASE_*-Env-Variablen oder rufe configureFirebase() auf.",
        );
    }

    const app = getApps()[0] ?? initializeApp(options);

    bundle = {
        app,
        db: initFirestore(app),
        storage: getStorage(app),
        auth: getAuth(app),
    };

    return bundle;
};

/**
 * `ignoreUndefinedProperties`: Felder mit Wert `undefined` werden beim
 * Schreiben verworfen, statt einen Fehler zu werfen.
 */
const initFirestore = (app: FirebaseApp): Firestore => {
    try {
        return initializeFirestore(app, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED,
            ignoreUndefinedProperties: true,
        });
    } catch {
        // Firestore lief schon (z.B. nach einem Fast Refresh).
        return getFirestore(app);
    }
};

/** Kurzform für `getFirebase().db`. */
export const getDb = (): Firestore => getFirebase().db;
/** Kurzform für `getFirebase().auth`. */
export const getFirebaseAuth = (): Auth => getFirebase().auth;
/** Kurzform für `getFirebase().storage`. */
export const getFirebaseStorage = (): FirebaseStorage => getFirebase().storage;
