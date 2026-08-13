"use client";

import React, { type FC } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import { useHasMounted } from "../../hooks/useHasMounted";
import { isLoggedIn } from "../../auth/isLoggedIn";
import { logout } from "../../auth/logout";

/**
 * Farben kommen aus dem Theme, damit die Leiste auch im Light Mode trägt.
 * Bei einem dunklen Theme mit `background.default: #171717` und weißem Text
 * ergibt das exakt die vorherigen festen Werte.
 */
const FooterContainer = styled("footer")(({ theme }) => ({
    position: "fixed",
    zIndex: 100,
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "0 0.5rem",
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    backdropFilter: "blur(10px)",
    background: alpha(theme.palette.background.default, 0.88),
    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`,
}));

export type FooterProps = {
    /** Zusätzliche Elemente, z.B. ein Copyright-Hinweis */
    children?: React.ReactNode;
};

/**
 * Fixierte Fußleiste mit Login/Logout und den Rechtstexten.
 * Welche Links erscheinen, steuert die `SiteConfig` (`auth`, `legal`).
 */
export const Footer: FC<FooterProps> = ({ children }) => {
    const { auth, legal } = useSiteConfig();
    const hasMounted = useHasMounted();

    // Erst nach dem Mount auswerten, localStorage gibt es beim SSR nicht.
    const loggedIn = hasMounted && isLoggedIn();

    const logoutRedirect = auth?.logoutRedirect ?? "/";

    return (
        <FooterContainer>
            <div>
                {auth?.enabled &&
                    (loggedIn ? (
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() =>
                                void logout(() => {
                                    window.location.href = logoutRedirect;
                                })
                            }
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            color="inherit"
                            component={Link}
                            href={auth.loginRoute ?? "/login"}
                            size="small"
                        >
                            Login
                        </Button>
                    ))}
            </div>
            {children}
            <div>
                {legal?.datenschutz && (
                    <Button
                        color="inherit"
                        component={Link}
                        href={legal.datenschutz}
                        size="small"
                    >
                        Datenschutz
                    </Button>
                )}
                {legal?.impressum && (
                    <Button
                        color="inherit"
                        component={Link}
                        href={legal.impressum}
                        size="small"
                    >
                        Impressum
                    </Button>
                )}
            </div>
        </FooterContainer>
    );
};
