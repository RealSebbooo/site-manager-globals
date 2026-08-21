import { createTheme, type Theme, type ThemeOptions } from "@mui/material/styles";
import "./augmentation";
import { brandThemeTokens } from "./brandTokens";

export type SiteThemeTokens = {
    mode?: "light" | "dark";
    /** Seitenhintergrund */
    background?: string;
    /** Karten, Modals, erhabene Flächen */
    surface?: string;
    text?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
    error?: string;
    fontFamily?: string;
};

const DARK_TOKENS = {
    mode: "dark",
    background: "#171717",
    surface: "#272727",
    text: "#ffffff",
    primary: "#ffff00",
    secondary: "#19857b",
    accent: "#ffeb3b",
    error: "#ff0000",
} as const;

/**
 * Eigene Vorgaben für den Light Mode. Ohne sie erbte eine helle Seite die
 * dunklen Werte oben und bekam weiße Schrift auf hellem Grund, sobald sie
 * auch nur einen Token vergaß. Die Werte sind die Marken-Palette der eigenen
 * Seiten, siehe `brandTokens.ts`.
 */
const LIGHT_TOKENS = brandThemeTokens;

/**
 * Baut das MUI-Theme einer Seite aus ein paar Farb-Tokens.
 *
 * `options` wird zuletzt gemergt und kann alles überschreiben
 * (Typografie, Component-Defaults, …).
 */
export const createSiteTheme = (
    tokens: SiteThemeTokens = {},
    options: ThemeOptions = {},
): Theme => {
    const defaults = tokens.mode === "light" ? LIGHT_TOKENS : DARK_TOKENS;
    const t = { ...defaults, ...tokens };

    return createTheme(
        {
            palette: {
                mode: t.mode,
                // `paper` gehört dazu: ohne den Wert bleiben alle Karten und
                // Dialoge auf MUIs Standard (#fff bzw. #121212) stehen, egal
                // welche Flächenfarbe die Seite gewählt hat.
                background: { default: t.background, paper: t.surface },
                surface: { main: t.surface },
                text: { primary: t.text },
                font: { main: t.text },
                accent: { main: t.accent },
                primary: { main: t.primary },
                secondary: { main: t.secondary },
                error: { main: t.error },
            },
            ...(t.fontFamily ? { typography: { fontFamily: t.fontFamily } } : {}),
        },
        options,
    );
};
