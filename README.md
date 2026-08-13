# @site/globals

Geteilte React-Bausteine für Websites von Vereinen und Kleinstfirmen, die
gemeinsame Basis aller Projekte im [site-manager](https://github.com/RealSebbooo/site-manager)-Monorepo.

Enthält ausschließlich generische Bausteine: Layout, Dialoge, Formularelemente,
einen Terminkalender, ein Beitrags-/News-Modul, Cookie-Einwilligung, dazu Hooks,
eine Theme-Factory und dünne Wrapper um Firebase, Auth und Firestore.
Nichts davon ist an ein bestimmtes Projekt gebunden.

## Installation

```bash
npm install github:RealSebbooo/site-manager-globals#main
```

Das Paket wird als **roher TypeScript-Source** ausgeliefert, es gibt keinen
Build-Step. Die konsumierende Next.js-App transpiliert es mit:

```js
// next.config.js
module.exports = {
    transpilePackages: ["@site/globals"],
};
```

Damit TypeScript die `exports`-Map versteht, braucht die App
`"moduleResolution": "bundler"` in der `tsconfig.json`.

Läuft mit Next.js 14 (Pages Router) und 15 (App Router), React 18, MUI v5.
Alle Laufzeit-Abhängigkeiten sind `peerDependencies` und kommen aus der App.

## Einstiegspunkte

| Import | Inhalt |
|---|---|
| `@site/globals/components` | Header, Footer, PageHead, Modal, Tabs, Dropdown, AddMenu, HelpPopup, ImagePreview, FileInput, EventCalendar, Contribution, ContributionEditor, PreviewBoxes, CookieConsent, HorizontalLine |
| `@site/globals/hooks` | `useHasMounted`, `useIsBreakpoint`, `useCollection`, `BREAKPOINT` |
| `@site/globals/config` | `SiteConfig`, `SiteConfigProvider`, `useSiteConfig` |
| `@site/globals/theme` | `createSiteTheme`, `SiteGlobalStyles`, `SiteToaster` |
| `@site/globals/firebase` | `getFirebase`, `configureFirebase`, `hasFirebaseConfig` |
| `@site/globals/auth` | `login`, `logout`, `isLoggedIn`, `getUser`, `sendPasswordReset` |
| `@site/globals/database` | `getCollection`, `setItemToDatabase`, `updateItemFromDatabase`, … |
| `@site/globals/utils` | `slugify`, `randomCode`, `getImageMeta`, `exportTablePdf` |
| `@site/globals/types` | `CalendarEvent`, `ContributionType`, `ThumbnailType`, … |

## Konfiguration einer Seite

Alles Seitenspezifische steckt in einem `SiteConfig`-Objekt, das oben in den
Baum gereicht wird. Header, Footer, PageHead und der Cookie-Banner lesen daraus:

```tsx
import { SiteConfigProvider } from "@site/globals/config";
import { createSiteTheme, SiteGlobalStyles } from "@site/globals/theme";

const theme = createSiteTheme(siteConfig.theme);

<ThemeProvider theme={theme}>
    <SiteConfigProvider config={siteConfig}>
        <SiteGlobalStyles />
        …
    </SiteConfigProvider>
</ThemeProvider>;
```

## Firebase

`getFirebase()` initialisiert **erst beim ersten Aufruf**, nicht beim Import.
Komponenten aus diesem Paket lassen sich damit auch in Apps ohne
Firebase-Konfiguration importieren. Gelesen werden die üblichen Variablen
(`NEXT_PUBLIC_FIREBASE_API_KEY`, `…_PROJECT_ID`, …); alternativ setzt
`configureFirebase(options)` sie explizit.

## Live ansehen

Im Monorepo demonstriert die `example`-App jede Komponente mit Code-Schnipsel:

```bash
npm run dev:example
```
