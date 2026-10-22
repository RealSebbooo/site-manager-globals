"use client";

import React, { useEffect, useState, type FC, type ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, type Breakpoint } from "@mui/material/styles";

export type InfoBannerTon =
    "primary" | "secondary" | "info" | "success" | "warning" | "error";

export type InfoBannerProps = {
    /** Der Hinweis selbst, ein, zwei Sätze. */
    children: ReactNode;
    /**
     * Farbe aus der Palette des Themes, samt passender Schriftfarbe
     * (`contrastText`). Voreingestellt `info`.
     */
    ton?: InfoBannerTon;
    /** Ein Link am Ende des Hinweises, etwa "Mehr erfahren". */
    link?: { href: string; label: string };
    /**
     * Mit Schließen-Knopf. Weggeklickt bleibt der Hinweis weg, bis sich die
     * `kennung` ändert. Für Pflichthinweise (Impressum, "keine offizielle
     * Seite") nicht setzen.
     */
    schliessbar?: boolean;
    /**
     * Was beim Schließen gemerkt wird. Voreingestellt der Text selbst, wenn
     * `children` ein String ist: ein neuer Hinweis erscheint dann von allein
     * wieder.
     */
    kennung?: string;
    /** Breite des Inhalts, wie beim `Container` der Seite. */
    maxWidth?: Breakpoint | false;
    /** Text mittig (Voreinstellung) oder linksbündig. */
    ausrichtung?: "center" | "left";
    /** Auch im Ausdruck zeigen. Voreingestellt ja. */
    imDruck?: boolean;
    /** Ein Zeichen vor dem Text. Sparsam einsetzen. */
    icon?: ReactNode;
};

const SPEICHER = "infobanner-geschlossen";

/**
 * Ein schmales Band über volle Breite, ganz oben über dem Kopf, für einen
 * Hinweis, der auf jeder Seite stehen soll.
 *
 * Gedacht für zweierlei: Pflichthinweise, die niemand übersehen darf (etwa
 * "Dies ist keine offizielle Seite des Vereins"), und kurze Ankündigungen
 * ("Am Samstag ist die Geschäftsstelle geschlossen"), die man wegklicken
 * kann. Die Farbe kommt aus der Palette, nie hart geschrieben, deshalb
 * passt das Band ohne Zutun zu jeder Seite.
 *
 * Gehört ins Root-Layout vor den Header. Rendert beim SSR mit, steht also im
 * HTML. Nur ein weggeklickter Hinweis verschwindet erst nach dem Mount, weil
 * `localStorage` auf dem Server nicht existiert.
 */
export const InfoBanner: FC<InfoBannerProps> = ({
    children,
    ton = "info",
    link,
    schliessbar = false,
    kennung,
    maxWidth = "lg",
    ausrichtung = "center",
    imDruck = true,
    icon,
}) => {
    const theme = useTheme();
    const farbe = theme.palette[ton];
    const merker =
        kennung ?? (typeof children === "string" ? children : "geschlossen");

    const [geschlossen, setGeschlossen] = useState(false);

    useEffect(() => {
        if (!schliessbar) return;
        try {
            setGeschlossen(window.localStorage.getItem(SPEICHER) === merker);
        } catch {
            // Gesperrter Speicher (privates Fenster): dann bleibt er stehen.
        }
    }, [schliessbar, merker]);

    if (geschlossen) return null;

    const schliessen = () => {
        try {
            window.localStorage.setItem(SPEICHER, merker);
        } catch {
            // Ohne Speicher gilt das Schließen nur bis zum Neuladen.
        }
        setGeschlossen(true);
    };

    return (
        <Box
            role={schliessbar ? "region" : "note"}
            aria-label="Hinweis"
            sx={{
                backgroundColor: farbe.main,
                color: farbe.contrastText,
                ...(imDruck ? {} : { "@media print": { display: "none" } }),
            }}
        >
            <Container
                maxWidth={maxWidth}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1.25,
                }}
            >
                {icon && (
                    <Box sx={{ display: "flex", flexShrink: 0 }} aria-hidden>
                        {icon}
                    </Box>
                )}
                <Typography
                    variant="body2"
                    component="p"
                    sx={{
                        flex: 1,
                        m: 0,
                        fontWeight: 500,
                        textAlign: ausrichtung,
                    }}
                >
                    {children}
                    {link && (
                        <>
                            {" "}
                            <Box
                                component={Link}
                                href={link.href}
                                sx={{
                                    color: "inherit",
                                    fontWeight: 700,
                                    textDecoration: "underline",
                                    textUnderlineOffset: "0.2em",
                                }}
                            >
                                {link.label}
                            </Box>
                        </>
                    )}
                </Typography>
                {schliessbar && (
                    <IconButton
                        size="small"
                        aria-label="Hinweis schließen"
                        onClick={schliessen}
                        sx={{ color: "inherit", flexShrink: 0 }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Container>
        </Box>
    );
};

export default InfoBanner;
