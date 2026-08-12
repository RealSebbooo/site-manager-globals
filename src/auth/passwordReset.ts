import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "../firebase/getFirebase";

/**
 * Löst die Passwort-Reset-Mail aus. Der Callback bekommt `"email-success"`
 * oder den Firebase-Fehlercode.
 */
export const sendPasswordReset = (
    email: string,
    callbackFunction: (result: string) => void,
) => {
    if (typeof window === "undefined") return;

    sendPasswordResetEmail(getFirebaseAuth(), email)
        .then(() => callbackFunction("email-success"))
        .catch((error: { code?: string }) =>
            callbackFunction(error.code ?? "unknown-error"),
        );
};
