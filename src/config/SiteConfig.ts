import type { SiteThemeTokens } from "../theme/createSiteTheme";

export type SiteNavigationItem = {
    name: string;
    route: string;

    /**
     * Untermenü. Bewusst nur eine Ebene tief: mehr passt weder in ein
     * Dropdown noch auf ein Handy, und niemand findet den dritten Klick.
     */
    children?: SiteNavigationItem[];

    /** Kurze Erklärzeile unter dem Namen, nur im Dropdown sichtbar. */
    description?: string;

    /** Eintrag nur zeigen, wenn jemand angemeldet ist. */
    requiresAuth?: boolean;
};

export type SiteSocialLinks = {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
    /** Vollständige `mailto:`-URL */
    email?: string;
    /** Vollständige `tel:`-URL */
    phone?: string;
};

export type SiteConfig = {
    /** Voller Name, landet im <title> und als Logo-alt */
    name: string;
    description: string;
    logoUrl?: string;
    faviconUrl?: string;

    navigation: SiteNavigationItem[];
    social?: SiteSocialLinks;

    /** Routen zu den Pflichtseiten. Fehlt eine, wird der Link ausgeblendet. */
    legal?: {
        impressum?: string;
        datenschutz?: string;
        agb?: string;
    };

    /** Login/Logout im Footer. Ohne `enabled` bleibt der Bereich leer. */
    auth?: {
        enabled?: boolean;
        loginRoute?: string;
        /** Wohin nach dem Logout weitergeleitet wird */
        logoutRedirect?: string;
    };

    /** Hintergrundbild des <body> */
    background?: {
        imageUrl?: string;
        size?: string;
        position?: string;
        repeat?: string;
        attachment?: string;
    };

    theme?: SiteThemeTokens;
};

/**
 * Fallback, damit Komponenten auch ohne Provider rendern statt zu crashen
 * (z.B. in Storybook-artigen Umgebungen oder Tests).
 */
export const FALLBACK_SITE_CONFIG: SiteConfig = {
    name: "Website",
    description: "",
    navigation: [],
};
