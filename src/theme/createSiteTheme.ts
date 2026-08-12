import { createTheme, type Theme, type ThemeOptions } from "@mui/material/styles";
import "./augmentation";

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

const DEFAULT_TOKENS = {
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
 * Baut das MUI-Theme einer Seite aus ein paar Farb-Tokens.
 *
 * `options` wird zuletzt gemergt und kann alles überschreiben
 * (Typografie, Component-Defaults, …).
 */
export const createSiteTheme = (
    tokens: SiteThemeTokens = {},
    options: ThemeOptions = {},
): Theme => {
    const t = { ...DEFAULT_TOKENS, ...tokens };

    return createTheme(
        {
            palette: {
                mode: t.mode,
                background: { default: t.background },
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
