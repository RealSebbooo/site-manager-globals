"use client";

import React, { type FC } from "react";
import Button from "@mui/material/Button";
import { setConsent } from "./hasConsent";

export type NoConsentButtonProps = {
    /** Name des Cookies, der gesetzt wird */
    consentName: string;
    /** Was der Nutzer damit freischaltet, z.B. "Google Maps" */
    displayName: string;
};

/**
 * Platzhalter für eine Funktion, die ohne Einwilligung nicht laufen darf.
 * Nach dem Klick erscheint das Feature sofort, vorausgesetzt, es liest die
 * Einwilligung mit `useConsent`.
 */
export const NoConsentButton: FC<NoConsentButtonProps> = ({
    consentName,
    displayName,
}) => {
    const activateCookie = () => setConsent(consentName);

    return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            Um {displayName} zu nutzen, musst du diesen Cookie akzeptieren.
            <Button variant="outlined" onClick={activateCookie}>
                Akzeptieren
            </Button>
        </div>
    );
};
