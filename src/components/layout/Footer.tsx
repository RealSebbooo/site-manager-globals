"use client";

import React, { type FC } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import { useHasMounted } from "../../hooks/useHasMounted";
import { isLoggedIn } from "../../auth/isLoggedIn";
import { logout } from "../../auth/logout";

const FooterContainer = styled("footer")({
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
    background: "rgba(23, 23, 23, 0.88)",
    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
});

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

    // Erst nach dem Mount auswerten — localStorage gibt es beim SSR nicht.
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
