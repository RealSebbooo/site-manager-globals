"use client";

import React, { type FC, useMemo, useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import type { Breakpoint } from "@mui/material/styles";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import { useActivePath } from "../../hooks/useActivePath";
import { useHasMounted } from "../../hooks/useHasMounted";
import { isLoggedIn } from "../../auth/isLoggedIn";
import { HeaderAuthArea } from "./HeaderAuthArea";
import { HeaderDrawer } from "./HeaderDrawer";
import { HeaderNavItem } from "./HeaderNavItem";
import { HeaderSocial } from "./HeaderSocial";
import { visibleNavigation } from "./navigationUtils";

export type HeaderProps = {
    /**
     * Aktive Route von außen. Nötig im Pages Router, wo es kein
     * `usePathname` gibt. Ohne Angabe kommt sie aus `next/navigation`.
     */
    activePath?: string;
    /** Zusätzliche Elemente ganz rechts, etwa ein Spenden-Knopf. */
    actions?: React.ReactNode;
    position?: "static" | "sticky";
    /** Container-Breite, damit Kopf und Seiteninhalt bündig stehen. */
    maxWidth?: Breakpoint | false;
    /**
     * Die Marke links. Ohne Angabe Logo und Name aus der `SiteConfig`,
     * `false` blendet sie ganz aus, eigene Elemente ersetzen sie.
     */
    brand?: React.ReactNode | false;
    /** Wo die Navigation sitzt. Ohne Marke ist `left` das Naheliegende. */
    align?: "left" | "center";
    /** @deprecated Die Farbe kommt aus dem Theme. */
    linkColor?: string;
};

/**
 * Die Standard-Kopfzeile: Marke links, Navigation mittig, rechts Anmeldung
 * und Social. Einträge mit `children` öffnen ein Dropdown, ab `md` auch beim
 * Überfahren. Unterhalb von `md` liegt alles im Drawer.
 *
 * Sie ist ein **Angebot, keine Vorschrift**. Damit nicht jede Seite gleich
 * aussieht, sind ihre Teile einzeln exportiert: `HeaderNavItem`,
 * `HeaderDrawer`, `HeaderAuthArea`, `HeaderSocial` und die Regeln in
 * `navigationUtils`. Wer eine eigene Kopfzeile will, baut sie daraus und
 * erbt trotzdem Untermenüs, Tastaturbedienung und aktive Route. Beispiel:
 * `projects/sv-musterhausen/src/components/layout/SiteHeader.tsx`.
 *
 * Alle Inhalte kommen aus der `SiteConfig`, hier steht nichts
 * Projektspezifisches.
 */
export const Header: FC<HeaderProps> = ({
    activePath,
    actions,
    position = "static",
    maxWidth = "lg",
    brand,
    align,
    linkColor,
}) => {
    const { name, logoUrl, navigation } = useSiteConfig();
    const path = useActivePath(activePath);
    const hasMounted = useHasMounted();
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Erst nach dem Mount auswerten, localStorage gibt es beim SSR nicht.
    const loggedIn = hasMounted && isLoggedIn();

    const items = useMemo(
        () => visibleNavigation(navigation, loggedIn),
        [navigation, loggedIn],
    );

    return (
        <>
            <AppBar position={position}>
                <Container maxWidth={maxWidth} disableGutters>
                    <Toolbar
                        sx={{
                            gap: 1,
                            px: { xs: 2, sm: 3 },
                            ...(linkColor ? { color: linkColor } : {}),
                        }}
                    >
                        {/* Der Fragment ringsherum ist kein Zierrat. Ein
                            eigenes `brand` entsteht in der aufrufenden Seite
                            und ist damit ein Element, das React noch nicht
                            geprüft hat. Sobald die Toolbar ihre Kinder als
                            eine Liste weiterreicht, verlangt React dafür
                            einen Schlüssel und meldet sonst „unique key prop“.
                            Der Fragment entsteht hier und trägt die Prüfung
                            selbst, ohne ein weiteres Element im DOM. */}
                        <React.Fragment key="brand">
                            {brand === false
                                ? null
                                : (brand ?? (
                                      <Stack
                                          direction="row"
                                          spacing={1.25}
                                          alignItems="center"
                                          component={Link}
                                          href="/"
                                          aria-label={`${name}, zur Startseite`}
                                          sx={{
                                              textDecoration: "none",
                                              color: "inherit",
                                              minWidth: 0,
                                          }}
                                      >
                                          {logoUrl && (
                                              <Box
                                                  component="img"
                                                  src={logoUrl}
                                                  alt=""
                                                  sx={{
                                                      height: {
                                                          xs: 30,
                                                          md: 38,
                                                      },
                                                      width: "auto",
                                                      flexShrink: 0,
                                                  }}
                                              />
                                          )}
                                          <Typography
                                              variant="h6"
                                              component="span"
                                              noWrap
                                              sx={{
                                                  fontWeight: 700,
                                                  letterSpacing: "-0.01em",
                                              }}
                                          >
                                              {name}
                                          </Typography>
                                      </Stack>
                                  ))}
                        </React.Fragment>

                        <Box
                            component="nav"
                            aria-label="Hauptnavigation"
                            sx={{
                                display: { xs: "none", md: "flex" },
                                flex: 1,
                                justifyContent:
                                    (align ??
                                        (brand === false
                                            ? "left"
                                            : "center")) === "left"
                                        ? "flex-start"
                                        : "center",
                                alignItems: "center",
                                gap: 0.25,
                            }}
                        >
                            {items.map((item) => (
                                <HeaderNavItem
                                    key={item.route}
                                    item={item}
                                    activePath={path}
                                />
                            ))}
                        </Box>

                        <Box sx={{ flex: { xs: 1, md: "none" } }} />

                        {/* Kein `divider` am Stack: `HeaderAuthArea` und
                            `HeaderSocial` rendern je nach Config `null`, und
                            MUI sieht dem Element das nicht an. Es blieben
                            Trennstriche ohne Nachbarn stehen. */}
                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            <HeaderAuthArea loggedIn={loggedIn} />
                            <HeaderSocial />
                            {actions}
                        </Stack>

                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Navigation öffnen"
                            aria-expanded={drawerOpen}
                            sx={{ display: { xs: "inline-flex", md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <HeaderDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navigation={items}
                activePath={path}
                loggedIn={loggedIn}
            />
        </>
    );
};
