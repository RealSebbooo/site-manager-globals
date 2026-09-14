"use client";

import React, { type FC } from "react";
import Typography from "@mui/material/Typography";

/** Name und Adresse stehen nur hier, damit ein Wechsel eine Stelle kostet. */
const URHEBER_NAME = "kochwebservice";
const URHEBER_URL = "https://www.kochwebservice.de";

export type ErstelltVonProps = {
    /** Schriftgröße, passend zu der Zeile, in der der Hinweis sitzt. */
    variant?: "caption" | "body2";
    /** Farbe. Voreingestellt erbt der Hinweis die Textfarbe des Fußes. */
    color?: string;
    /** Deckkraft. Dimmt die Zeile ringsum schon, gehört hier eine 1 hin. */
    opacity?: number;
};

/**
 * Kleiner Urhebervermerk für den Seitenfuß, mit Link auf die eigene Seite.
 *
 * Bewusst ohne eigene Farbe: über `color: "inherit"` trägt der Hinweis auf
 * einem hellen Fuß genauso wie auf einer dunklen Fläche. Der Link öffnet
 * einen neuen Tab, damit der Besucher die Kundenseite nicht verlässt.
 *
 * Die Deckkraft sitzt am äußeren Element, weil sie einen eigenen Kontext
 * aufspannt: ein Kind kann nicht heller werden als sein Elternteil. Darum
 * hellt der Hover die ganze Wendung auf, nicht nur den Namen. Was klickbar
 * ist, zeigt der Unterstrich.
 */
export const ErstelltVon: FC<ErstelltVonProps> = ({
    variant = "caption",
    color = "inherit",
    opacity = 0.7,
}) => (
    <Typography
        variant={variant}
        component="span"
        sx={{
            color,
            opacity,
            transition: "opacity .2s",
            "&:hover": { opacity: 1 },
        }}
    >
        Erstellt von{" "}
        <Typography
            variant={variant}
            component="a"
            href={URHEBER_URL}
            target="_blank"
            rel="noopener"
            sx={{
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px solid currentColor",
            }}
        >
            {URHEBER_NAME}
        </Typography>
    </Typography>
);
