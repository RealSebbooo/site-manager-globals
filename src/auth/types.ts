export type UserObjectType = {
    email: string;
    password: string;
};

/** Was nach dem Login im localStorage liegt: das Firestore-User-Dokument. */
export type StoredUser = {
    email: string;
    id?: string;
    admin?: boolean;
    [key: string]: unknown;
};
