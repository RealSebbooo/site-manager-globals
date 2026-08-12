import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import toast from "react-hot-toast";
import { getFirebaseAuth } from "../firebase/getFirebase";
import { getUserFromDatabase } from "../database/getUserFromDatabase";
import type { UserObjectType } from "./types";

const ERROR_MESSAGES: Record<string, string> = {
    "auth/user-not-found": "E-Mail Adresse konnte nicht gefunden werden",
    "auth/invalid-email": "Ungültige E-Mail Adresse",
    "auth/invalid-credential": "Ungültige Zugangsdaten",
    "auth/wrong-password": "Falsches Passwort",
    "auth/too-many-requests":
        "Zu viele falsche Versuche, der Account wurde vorübergehend deaktiviert.",
};

export const login = async (user: UserObjectType, callback: () => void) => {
    if (typeof window === "undefined") return;

    const normalizedEmail = user.email.replaceAll(" ", "").toLowerCase();

    try {
        await signInWithEmailAndPassword(
            getFirebaseAuth(),
            normalizedEmail,
            user.password,
        );

        const dbUser = await getUserFromDatabase(normalizedEmail);

        localStorage.setItem(
            "user",
            JSON.stringify(dbUser ?? { email: normalizedEmail }),
        );

        callback();
    } catch (error) {
        const code = (error as AuthError).code;
        toast.error(ERROR_MESSAGES[code] ?? "Login fehlgeschlagen");
    }
};
