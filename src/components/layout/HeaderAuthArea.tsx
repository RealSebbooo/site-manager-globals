"use client";

import React, { type FC } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/LoginOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import { logout } from "../../auth/logout";

export type HeaderAuthAreaProps = {
    /** Ergebnis von `isLoggedIn()`, erst nach dem Mount ausgewertet. */
    loggedIn: boolean;
    /** Im Drawer soll der Knopf die volle Breite einnehmen. */
    fullWidth?: boolean;
    onNavigate?: () => void;
};

/**
 * Anmelden bzw. Abmelden in der Kopfzeile.
 *
 * Erscheint nur, wenn `auth.enabled` in der `SiteConfig` gesetzt ist. Den
 * Anmeldezustand reicht die Kopfzeile herein, damit sie ihn nur einmal
 * ermittelt und Leiste und Drawer nicht auseinanderlaufen.
 */
export const HeaderAuthArea: FC<HeaderAuthAreaProps> = ({
    loggedIn,
    fullWidth = false,
    onNavigate,
}) => {
    const { auth } = useSiteConfig();

    if (!auth?.enabled) return null;

    const logoutRedirect = auth.logoutRedirect ?? "/";

    if (loggedIn) {
        return (
            <Button
                color="inherit"
                size="small"
                fullWidth={fullWidth}
                startIcon={<LogoutIcon fontSize="small" />}
                onClick={() => {
                    onNavigate?.();
                    void logout(() => {
                        window.location.href = logoutRedirect;
                    });
                }}
            >
                Abmelden
            </Button>
        );
    }

    return (
        <Button
            color="inherit"
            size="small"
            fullWidth={fullWidth}
            component={Link}
            href={auth.loginRoute ?? "/login"}
            onClick={onNavigate}
            startIcon={<LoginIcon fontSize="small" />}
        >
            Anmelden
        </Button>
    );
};
