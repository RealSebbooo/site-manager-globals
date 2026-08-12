import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
    type QueryConstraint,
    type WhereFilterOp,
} from "firebase/firestore";
import { getDb } from "../firebase/getFirebase";

export type CollectionFilter = [field: string, op: WhereFilterOp, value: unknown];

export type GetCollectionOptions = {
    filters?: CollectionFilter[];
    orderByField?: string;
    direction?: "asc" | "desc";
};

/**
 * Liest eine ganze Collection und hängt die Dokument-ID als `uid` an.
 *
 * Ohne `options` ist das genau das, was fast jede Seite braucht; Filter und
 * Sortierung laufen bei Bedarf serverseitig (Firestore-Index beachten).
 */
export const getCollection = async <T,>(
    collectionName: string,
    options: GetCollectionOptions = {},
): Promise<Array<T & { uid: string }>> => {
    const constraints: QueryConstraint[] = [];

    options.filters?.forEach(([field, op, value]) =>
        constraints.push(where(field, op, value)),
    );

    if (options.orderByField) {
        constraints.push(orderBy(options.orderByField, options.direction));
    }

    const snapshot = await getDocs(
        query(collection(getDb(), collectionName), ...constraints),
    );

    return snapshot.docs.map(
        (item) => ({ ...item.data(), uid: item.id }) as T & { uid: string },
    );
};
