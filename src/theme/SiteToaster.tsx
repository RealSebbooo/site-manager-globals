"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

/** `react-hot-toast` mit den Farben des aktuellen Themes. */
export const SiteToaster = () => {
    const theme = useTheme();

    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 2500,
                style: {
                    background: theme.palette.info.main,
                    color: "#fff",
                },
                success: {
                    duration: 2500,
                    style: { background: theme.palette.success.main },
                },
                error: {
                    duration: 5000,
                    style: { background: theme.palette.error.main },
                },
            }}
        />
    );
};
