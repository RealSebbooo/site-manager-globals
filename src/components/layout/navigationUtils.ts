import type { SiteNavigationItem } from "../../config/SiteConfig";

/**
 * Hilfsfunktionen der Kopfzeile. Stehen hier, damit Desktop-Leiste und
 * Drawer dieselbe Antwort auf "ist das gerade aktiv?" geben.
 */

/**
 * Aktiv ist ein Eintrag, wenn die Route genau passt oder eine Unterseite
 * davon offen ist. Die Startseite ist die Ausnahme: `/` würde sonst auf
 * jeder Seite leuchten.
 */
export const isActiveRoute = (path: string, route: string): boolean => {
    if (route === "/") return path === "/";
    return path === route || path.startsWith(`${route}/`);
};

/** Ein Elternteil gilt als aktiv, sobald eines seiner Kinder aktiv ist. */
export const isBranchActive = (
    path: string,
    item: SiteNavigationItem,
): boolean =>
    isActiveRoute(path, item.route) ||
    (item.children ?? []).some((child) => isActiveRoute(path, child.route));

/**
 * Filtert `requiresAuth`-Einträge heraus, solange niemand angemeldet ist.
 * Rekursiv, weil auch einzelne Kinder geschützt sein dürfen.
 */
export const visibleNavigation = (
    items: SiteNavigationItem[],
    loggedIn: boolean,
): SiteNavigationItem[] =>
    items
        .filter((item) => !item.requiresAuth || loggedIn)
        .map((item) =>
            item.children
                ? {
                      ...item,
                      children: visibleNavigation(item.children, loggedIn),
                  }
                : item,
        );
