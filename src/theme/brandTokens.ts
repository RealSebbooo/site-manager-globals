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
    surface: "#ffffff",
    text: "#141414",
    primary: BRAND_BLUE,
    secondary: "#0f766e",
    accent: "#b45309",
    error: "#b91c1c",
} as const satisfies SiteThemeTokens;

/**
 * Die Dark-Variante derselben Marken-Palette. Die eigenen Seiten laufen zwar
 * immer im Light Mode (siehe `mode: "light"` oben), aber `createSiteTheme`
 * braucht einen Dark-Default, der greift, sobald eine Seite `mode: "dark"`
 * setzt oder einen Token vergisst. Ohne diese Werte fiel der Dark-Zweig auf
 * MUIs Signalfarben zurück (gelbes Primary auf Schwarz), was fälschlich wie
 * das kolbädrescher-Theme aussah.
 *
 * Farben aus der Light-Palette, für dunklen Grund aufgehellt: das Blau und
 * das Türkis brauchen mehr Helligkeit, um auf `background` lesbar zu bleiben.
 */
export const brandThemeDarkTokens = {
    mode: "dark",
    background: "#0e1420",
    surface: "#18202e",
    text: "#e9ecf3",
    primary: "#8fa9d0",
    secondary: "#2dd4bf",
    accent: "#e0a94f",
    error: "#f87171",
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
