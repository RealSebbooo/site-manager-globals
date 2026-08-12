import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { getDb } from "../firebase/getFirebase";

/** Legt ein neues Dokument an und gibt dessen ID zurück. */
export const setItemToDatabase = async (
    collectionName: string,
    data: Record<string, unknown>,
): Promise<string> => {
    const docRef = await addDoc(collection(getDb(), collectionName), data);
    return docRef.id;
};

export const getItemFromDatabase = async (
    collectionName: string,
    id: string,
) => {
    const snapshot = await getDoc(doc(getDb(), collectionName, id));
    return snapshot.data();
};

/**
 * Überschreibt das Dokument mit `item.uid` vollständig — Felder, die im
 * übergebenen Objekt fehlen, sind danach weg.
 */
export const updateItemFromDatabase = async (
    collectionName: string,
    item: { uid?: string } & Record<string, unknown>,
) => {
    if (!item.uid) {
        throw new Error(
            `[@site/globals] updateItemFromDatabase("${collectionName}") ohne uid aufgerufen.`,
        );
    }
    return setDoc(doc(getDb(), collectionName, item.uid), item);
};

export const deleteItemFromDatabase = async (
    collectionName: string,
    id: string,
) => {
    await deleteDoc(doc(getDb(), collectionName, id));
};
