import type { ThemeOptions } from "@mui/material/styles";
import type { SiteThemeTokens } from "./createSiteTheme";

/**
 * Die eine Wahrheit für die eigenen Oberflächen: marketing, admin und portal
 * teilen sich diese Palette. Wer eine Farbe der eigenen Seiten ändern will,
 * ändert sie hier und nirgends sonst.
 *
 * Kundenprojekte unter `projects/` haben eigene Farben und importieren das
 * hier bewusst nicht. Die Werte stammen aus der Marketing-Seite, die als
 * Vorbild gilt.
 */

/**
 * Das eine Blau: Kopfleiste, Hero, Schaltflächen und Akzente benutzen
 * denselben Wert. Ein dunkles, entsättigtes Blau, ruhiger als ein
 * Signalblau und mit knapp 8:1 Kontrast gegen Weiß gut lesbar.
 */
export const BRAND_BLUE = "#34527a";

/**
 * Farb-Tokens der eigenen Seiten. `as const` hält die Werte als konkrete
 * Strings fest, damit `createSiteTheme` sie als Light-Default ohne
 * `undefined` benutzen kann; `satisfies` prüft die Form gegen `SiteThemeTokens`.
 */
export const brandThemeTokens = {
    mode: "light",
    background: "#F9F9Ff",
    // Karten und Dialoge heben sich als reines Weiß vom Seitenhintergrund ab.
    surface: "#ffffff",
    text: "#141414",
    primary: BRAND_BLUE,
    secondary: "#0f766e",
    accent: "#b45309",
    error: "#b91c1c",
} as const satisfies SiteThemeTokens;

/**
 * Typografie und Form der eigenen Seiten, was über die Farb-Tokens hinausgeht.
 * `createSiteTheme` mergt das als `options`. Einzelne Seiten dürfen darauf
 * aufsetzen und Strukturelles überschreiben (etwa admin: flache Karten).
 */
export const brandThemeOptions: ThemeOptions = {
    shape: { borderRadius: 12 },
    typography: {
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        h3: { fontWeight: 800, letterSpacing: "-0.01em" },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
    },
};
