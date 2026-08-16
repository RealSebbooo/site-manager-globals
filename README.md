# @site/globals

Geteilte React-Bausteine für Websites von Vereinen und Kleinstfirmen, die
gemeinsame Basis aller Projekte im [site-manager](https://github.com/RealSebbooo/site-manager)-Monorepo.

Enthält ausschließlich generische Bausteine: Layout, Dialoge, Formularelemente,
einen Terminkalender, ein Beitrags-/News-Modul, Cookie-Einwilligung, dazu Hooks,
eine Theme-Factory und dünne Wrapper um Firebase, Auth und Firestore.
Nichts davon ist an ein bestimmtes Projekt gebunden.

## Installation

```bash
npm install git+https://github.com/RealSebbooo/site-manager-globals.git#main
```

Immer diese Langform, nie die Kurzform `github:…`: mit ihr bricht der
Vercel-Build.

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

## Jede Änderung bekommt eine neue Version

Das passiert von selbst: `.githooks/pre-commit` zählt die Patch-Version hoch,
sobald ein Commit etwas unter `src/` anfasst, und legt die `package.json` mit
in denselben Commit. Wer die Version schon von Hand gesetzt hat, etwa auf eine
neue Minor-Version, wird nicht überstimmt; Änderungen außerhalb von `src/`
lösen nichts aus.

Der Grund steckt darin, wie npm installiert. Das Paket hängt in den Projekten
als Zweig, `…#main`, die Fassung steht also nur in deren `package-lock.json`.
Beim Installieren vergleicht npm die Angaben aus
`node_modules/.package-lock.json` mit denen der Lockdatei und sieht sich den
Ordnerinhalt nie an. Stehen dort dieselbe Version und derselbe Commit, wird das
Paket übersprungen, auch wenn im Ordner eine ältere Fassung liegt. Auf einem
Rechner mit warmem `node_modules`, etwa im Build-Cache von Vercel, überlebt so
eine alte Kopie beliebig viele Deploys: die Seite wird dann aus neuem
Projektcode und alten globals gebaut, und es sieht aus, als sei die Änderung
nie angekommen. Eine höhere Version ist das eine Feld, an dem npm den
Unterschied bemerkt und den Ordner wegwirft.

Hinter dem `pre-commit` steht ein `pre-push`, der den Push verweigert, falls
doch einmal eine Quelländerung ohne neue Version durchrutscht, etwa aus einem
Commit mit `--no-verify`. Beide Hooks hängen an `core.hooksPath`, das jede
Arbeitskopie einmal setzen muss:

```bash
git config core.hooksPath .githooks
```

Danach zieht `npm run update:globals` im Monorepo die vier Lockdateien nach und
zeigt, wer auf welcher Fassung steht. Für die gebauten Seiten zählt allein die
Lockdatei, die geänderten Dateien gehören also committet.

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
