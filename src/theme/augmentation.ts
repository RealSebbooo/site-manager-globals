/**
 * Erweitert die MUI-Palette um die Keys, die `createSiteTheme` zusätzlich setzt.
 *
 * Jede Datei, die `theme.palette.surface` / `.accent` / `.font` liest, muss
 * dieses Modul importieren (`import "../../theme/augmentation";`), sonst kennt
 * TypeScript die Keys dort nicht.
 */
import "@mui/material/styles";

export type SitePaletteColor = {
    main: string;
};

declare module "@mui/material/styles" {
    interface Palette {
        surface: SitePaletteColor;
        accent: SitePaletteColor;
        font: SitePaletteColor;
    }
    interface PaletteOptions {
        surface?: SitePaletteColor;
        accent?: SitePaletteColor;
        font?: SitePaletteColor;
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        surface: true;
    }
}
