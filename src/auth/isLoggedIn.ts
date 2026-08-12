/**
 * Reine UI-Anzeige, KEINE Sicherheitsprüfung — die passiert in den
 * Firestore-Rules. Hier steht nur, ob im Browser ein Login hinterlegt ist.
 */
export const isLoggedIn = (): boolean => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("user"));
};
