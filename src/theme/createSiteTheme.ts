import {
    createTheme,
    type Theme,
    type ThemeOptions,
} from "@mui/material/styles";
import "./augmentation";
import { brandThemeDarkTokens, brandThemeTokens } from "./brandTokens";

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

const DARK_TOKENS = brandThemeDarkTokens;

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
    const defaults = tokens.mode === "dark" ? DARK_TOKENS : LIGHT_TOKENS;
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
            ...(t.fontFamily
                ? { typography: { fontFamily: t.fontFamily } }
                : {}),
        },
        options,
    );
};
