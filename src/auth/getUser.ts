import type { StoredUser } from "./types";

/** Das beim Login gespeicherte User-Dokument, oder `undefined`. */
export const getUser = (): StoredUser | undefined => {
    if (typeof window === "undefined") return undefined;

    const raw = localStorage.getItem("user");
    if (!raw) return undefined;

    try {
        return JSON.parse(raw) as StoredUser;
    } catch {
        return undefined;
    }
};
