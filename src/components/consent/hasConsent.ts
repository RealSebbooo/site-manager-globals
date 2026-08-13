"use client";

const ONE_YEAR = 31536000;

const listeners = new Set<() => void>();

/** True, wenn der Nutzer den benannten Cookie akzeptiert hat. */
export const hasConsent = (cookie: string): boolean => {
    if (typeof document === "undefined") return false;
    return document.cookie.split("; ").includes(`${cookie}=true`);
};

/**
 * Setzt den Einwilligungs-Cookie und meldet die Änderung.
 * Komponenten, die `useConsent` benutzen, aktualisieren sich dadurch sofort,
 * ohne dass die Seite neu geladen werden muss.
 */
export const setConsent = (cookie: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${cookie}=true; max-age=${ONE_YEAR}; path=/`;
    notifyConsentChanged();
};

/** Weckt alle `useConsent`-Leser, etwa nachdem mehrere Cookies gesetzt wurden. */
export const notifyConsentChanged = (): void => {
    listeners.forEach((listener) => listener());
};

/** Abo für `useConsent`. Gibt die Abmeldefunktion zurück. */
export const subscribeConsent = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};
