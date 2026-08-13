"use client";

import { useSyncExternalStore } from "react";
import { hasConsent, subscribeConsent } from "./hasConsent";

/**
 * Wie `hasConsent`, nur reaktiv: Sobald die Einwilligung erteilt wird, rendert
 * die Komponente neu, kein Neuladen der Seite nötig.
 *
 * Beim Server-Render und beim Hydrieren ist der Wert immer `false`, sonst
 * gäbe es einen Hydration-Mismatch (Cookies kennt der Server nicht).
 */
export const useConsent = (cookie: string): boolean =>
    useSyncExternalStore(
        subscribeConsent,
        () => hasConsent(cookie),
        () => false,
    );
