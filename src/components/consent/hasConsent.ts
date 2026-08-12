/** True, wenn der Nutzer den benannten Cookie akzeptiert hat. */
export const hasConsent = (cookie: string): boolean => {
    if (typeof document === "undefined") return false;
    return document.cookie.split("; ").includes(`${cookie}=true`);
};
