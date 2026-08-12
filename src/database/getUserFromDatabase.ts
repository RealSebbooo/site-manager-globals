import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "../firebase/getFirebase";
import type { StoredUser } from "../auth/types";

/** Sucht das User-Dokument zu einer E-Mail in der `Users`-Collection. */
export const getUserFromDatabase = async (
    email: string,
    collectionName = "Users",
): Promise<StoredUser | undefined> => {
    const snapshot = await getDocs(
        query(collection(getDb(), collectionName), where("email", "==", email)),
    );

    const first = snapshot.docs[0];
    if (!first) return undefined;

    return { ...first.data(), id: first.id } as StoredUser;
};
