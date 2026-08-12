"use client";

import React, { type FC } from "react";
import Button from "@mui/material/Button";

export type NoConsentButtonProps = {
    /** Name des Cookies, der gesetzt wird */
    consentName: string;
    /** Was der Nutzer damit freischaltet, z.B. "Google Maps" */
    displayName: string;
};

/**
 * Platzhalter für eine Funktion, die ohne Einwilligung nicht laufen darf.
 * Nach dem Klick wird die Seite neu geladen, damit das Feature erscheint.
 */
export const NoConsentButton: FC<NoConsentButtonProps> = ({
    consentName,
    displayName,
}) => {
    const activateCookie = () => {
        if (typeof document === "undefined") return;
        document.cookie = `${consentName}=true; max-age=31536000; path=/`;
        window.location.reload();
    };

    return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            Um {displayName} zu nutzen, musst du diesen Cookie akzeptieren.
            <Button variant="outlined" onClick={activateCookie}>
                Akzeptieren
            </Button>
        </div>
    );
};
