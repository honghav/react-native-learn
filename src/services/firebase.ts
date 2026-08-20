import { Platform } from "react-native";

// Web Firebase JS SDK imports
import { getApp as getWebApp, getApps as getWebApps, initializeApp as initWebApp } from "firebase/app";
import {
    getFirestore as getWebFirestore,
    addDoc as webAddDoc,
    collection as webCollection,
    getDocs as webGetDocs,
    onSnapshot as webOnSnapshot,
    orderBy as webOrderBy,
    query as webQuery,
    serverTimestamp as webServerTimestamp
} from "firebase/firestore";

// Native React Native Firebase imports
import {
    getFirestore as getNativeFirestore,
    addDoc as nativeAddDoc,
    collection as nativeCollection,
    getDocs as nativeGetDocs,
    onSnapshot as nativeOnSnapshot,
    orderBy as nativeOrderBy,
    query as nativeQuery,
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

export interface ChatMessageDTO {
    id?: string;
    text: string;
    sender: string;
    createdAt?: any;
}

// Real-time Chat Firestore Listener
export const subscribeToRealtimeChat = (onUpdate: (messages: ChatMessageDTO[]) => void) => {
    try {
        if (Platform.OS === "web") {
            const db = getWebDb();
            const q = webQuery(webCollection(db, "messages"), webOrderBy("createdAt", "asc"));
            return webOnSnapshot(q, (snapshot) => {
                const list: ChatMessageDTO[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as any),
                }));
                onUpdate(list);
            });
        } else {
            const db = getNativeFirestore();
            const q = nativeQuery(nativeCollection(db, "messages"), nativeOrderBy("createdAt", "asc"));
            return nativeOnSnapshot(q, (snapshot) => {
                const list: ChatMessageDTO[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as any),
                }));
                onUpdate(list);
            });
        }
    } catch (error) {
        console.error("Error subscribing to realtime chat:", error);
        return () => {};
    }
};

// Send real-time chat message
export const sendChatMessage = async (text: string, sender: string) => {
    if (Platform.OS === "web") {
        const db = getWebDb();
        return await webAddDoc(webCollection(db, "messages"), {
            text,
            sender,
            createdAt: webServerTimestamp(),
        });
    } else {
        const db = getNativeFirestore();
        return await nativeAddDoc(nativeCollection(db, "messages"), {
            text,
            sender,
            createdAt: nativeServerTimestamp(),
        });
    }
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
            const db = getWebDb();
            const response = await webGetDocs(webCollection(db, collectionName));
            return response;
        } else {
            const db = getNativeFirestore();
            const response = await nativeGetDocs(nativeCollection(db, collectionName));
            return response;
        }
    } catch (error) {
        console.error("Error fetching FireBase:", error);
        throw error;
    }
};
