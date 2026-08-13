"use client";

import React, { type FC, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CookieIcon from "@mui/icons-material/Cookie";
import { useTheme } from "@mui/material/styles";
import "../../theme/augmentation";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import { setConsent } from "./hasConsent";

export type CookieConsentProps = {
    /**
     * Cookies, die bei "Annehmen" gesetzt werden.
     * Default: `["maps"]`, die typische Google-Maps-Einbindung.
     */
    optionalCookies?: string[];
    text?: string;
};

const BANNER_COOKIE = "banner";

/** Einwilligungs-Banner unten rechts. Verschwindet nach der Entscheidung. */
export const CookieConsent: FC<CookieConsentProps> = ({
    optionalCookies = ["maps"],
    text = "Um alle Funktionen dieser Seite nutzen zu können, musst du leider unsere Kekse akzeptieren.",
}) => {
    const theme = useTheme();
    const { legal } = useSiteConfig();
    const [decided, setDecided] = useState(true);

    useEffect(() => {
        if (typeof document === "undefined") return;
        setDecided(
            document.cookie.split("; ").includes(`${BANNER_COOKIE}=true`),
        );
    }, []);

    if (decided) return null;

    const decline = () => {
        setConsent(BANNER_COOKIE);
        setDecided(true);
    };

    const accept = () => {
        // `setConsent` meldet jede Änderung, damit eingebettete Inhalte wie
        // der Instagram-Feed sofort nachladen statt erst beim nächsten Aufruf.
        optionalCookies.forEach(setConsent);
        decline();
    };

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                zIndex: 1200,
                bottom: "4rem",
                right: 0,
                maxWidth: 400,
                minHeight: 100,
                p: 2,
                borderRadius: 1,
                backgroundColor: theme.palette.surface.main,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Stack direction="row" alignItems="center" gap={1}>
                Cookies
                <CookieIcon />
            </Stack>
            <span>{text}</span>

            {legal?.datenschutz && (
                <Button
                    variant="outlined"
                    component={Link}
                    href={legal.datenschutz}
                >
                    Datenschutz
                </Button>
            )}

            <Stack direction="row" gap={2} justifyContent="space-evenly">
                <Button onClick={decline}>Ablehnen</Button>
                <Button variant="contained" onClick={accept}>
                    Annehmen
                </Button>
            </Stack>
        </Paper>
    );
};
