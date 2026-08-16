"use client";

import React from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useTheme } from "@mui/material/styles";
import { useSiteConfig } from "../config/SiteConfigProvider";

/**
 * Basis-Styles, die jede Seite braucht: Body-Farben, optionales
 * Hintergrundbild aus der `SiteConfig` und ein lesbares `<textarea>`.
 *
 * Bewusst NICHT hier drin: projektspezifische MUI-Overrides. Die gehören in
 * die jeweilige App, sonst erbt sie jede neue Seite mit.
 */
export const SiteGlobalStyles = () => {
    const theme = useTheme();
    const { background } = useSiteConfig();

    const isDark = theme.palette.mode === "dark";

    return (
        <GlobalStyles
            styles={{
                body: {
                    margin: 0,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    ...(background?.imageUrl
                        ? {
                              backgroundImage: `url('${background.imageUrl}')`,
                              backgroundRepeat: background.repeat ?? "no-repeat",
                              backgroundAttachment:
                                  background.attachment ?? "fixed",
                              backgroundSize: background.size ?? "60%",
                              backgroundPosition: background.position ?? "50%",
                          }
                        : {}),
                },
                ".flexBox": {
                    display: "flex",
                    flexDirection: "column",
                },
                ".MuiTabs-flexContainer": {
                    overflow: "auto",
                },
                // Nur nackte Textfelder. Ein `<textarea>` innerhalb eines
                // MUI-Feldes bringt Rahmen, Polster und Abstand schon mit;
                // ohne diese Ausnahme säße ein zweiter Rahmen im ersten.
                "textarea:not(.MuiInputBase-input)": {
                    boxSizing: "border-box",
                    width: "100%",
                    fontSize: "1rem",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    padding: "8px 12px",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    color: isDark
                        ? theme.palette.grey[300]
                        : theme.palette.grey[900],
                    background: isDark ? "transparent" : "#fff",
                    border: `1px solid ${
                        isDark ? theme.palette.grey[700] : theme.palette.grey[200]
                    }`,
                    boxShadow: `0px 2px 2px ${
                        isDark ? theme.palette.grey[900] : theme.palette.grey[50]
                    }`,
                    "&:hover": {
                        borderColor: theme.palette.primary.main,
                    },
                    "&:focus": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 3px ${theme.palette.primary.main}`,
                    },
                    "&:focus-visible": {
                        outline: 0,
                    },
                },
            }}
        />
    );
};
