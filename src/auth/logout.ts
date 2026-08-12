import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { getFirebaseAuth } from "../firebase/getFirebase";

export const logout = async (callback: () => void) => {
    if (typeof window === "undefined") return;

    try {
        await signOut(getFirebaseAuth());
        localStorage.removeItem("user");
        toast.success("Abmeldung erfolgreich");
        callback();
    } catch (_error) {
        toast.error("Abmeldung fehlgeschlagen");
    }
};
