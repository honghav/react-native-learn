import { Platform } from "react-native";

// Web Firebase JS SDK imports
import { getApp as getWebApp, getApps as getWebApps, initializeApp as initWebApp } from "firebase/app";
import {
    getFirestore as getWebFirestore,
    addDoc as webAddDoc,
    collection as webCollection,
    getDocs as webGetDocs,
    serverTimestamp as webServerTimestamp
} from "firebase/firestore";

// Native React Native Firebase imports
import {
    getFirestore as getNativeFirestore,
    addDoc as nativeAddDoc,
    collection as nativeCollection,
    getDocs as nativeGetDocs,
    serverTimestamp as nativeServerTimestamp
} from "@react-native-firebase/firestore";

// Credentials for Web Platform
const webFirebaseConfig = {
    apiKey: "AIzaSyBBO8PO-01r5HKyrzF9KJhIWGmQyrOJGoY",
    projectId: "expense-mini-app",
    storageBucket: "expense-mini-app.firebasestorage.app",
    appId: "1:776577593090:android:0a526a260d71dcd5131c1b",
};

// Lazy Web Firestore initializer
export const getWebDb = () => {
    const app = getWebApps().length === 0 ? initWebApp(webFirebaseConfig) : getWebApp();
    return getWebFirestore(app);
};


// Cross-platform helper: Works on Web AND Native (Android / iOS)
export const createDataFirestore = async (collection: string, body: any) => {
    if (Platform.OS === "web") {
        const db = getWebDb();
        const docRef = await webAddDoc(webCollection(db, collection), {
            body: body,
            createdAt: webServerTimestamp(),
        });
        return docRef;
    } else {
        const db = getNativeFirestore();
        const docRef = await nativeAddDoc(nativeCollection(db, collection), {
            body: body,
            createdAt: nativeServerTimestamp(),
        });
        return docRef;
    }
};
export const fetchDataFirestore = async (collectionName: string) => {
    try {
        if (Platform.OS === "web") {
            // Web: Using Firebase JS SDK (v9+ modular syntax)
            const db = getWebDb();
            const response = await webGetDocs(webCollection(db, collectionName));
            return response;
        } else {
            // Native: Using @react-native-firebase/firestore (v26+ modular syntax)
            const db = getNativeFirestore();
            const response = await nativeGetDocs(nativeCollection(db, collectionName));
            return response;
        }
    } catch (error) {
        console.error("Error fetching FireBase:", error);
        throw error;
    }
};
