"use client";

import React, { type FC, type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, useTheme } from "@mui/material/styles";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import type { SiteNavigationItem } from "../../config/SiteConfig";
import { HeaderAuthArea } from "./HeaderAuthArea";
import { HeaderSocial } from "./HeaderSocial";
import { isActiveRoute, isBranchActive } from "./navigationUtils";

const DRAWER_WIDTH = 300;

export type HeaderDrawerProps = {
    open: boolean;
    onClose: () => void;
    navigation: SiteNavigationItem[];
    activePath: string;
    loggedIn: boolean;
    /** Ersetzt Logo und Name im Kopf des Drawers. */
    brand?: ReactNode;
    /**
     * Ersetzt den Anmelde-Bereich unten. Nötig, sobald ein Projekt eine
     * eigene Anmeldung hat: `HeaderAuthArea` hängt an `isLoggedIn()` aus
     * `globals`, das nur den `localStorage` liest.
     */
    authArea?: ReactNode;
};

/**
 * Die Navigation auf dem Handy.
 *
 * Ein Eintrag mit Kindern bekommt zwei Bedienflächen: der Text führt auf die
 * Elternseite, der Pfeil klappt die Kinder auf. Wer beides auf denselben
 * Knopf legt, macht die Übersichtsseite unerreichbar.
 */
export const HeaderDrawer: FC<HeaderDrawerProps> = ({
    open,
    onClose,
    navigation,
    activePath,
    loggedIn,
    brand,
    authArea,
}) => {
    const theme = useTheme();
    const { name, logoUrl } = useSiteConfig();
    const [expanded, setExpanded] = useState<string[]>([]);

    // Der Zweig, in dem man gerade steht, ist beim Öffnen schon aufgeklappt.
    useEffect(() => {
        if (!open) return;
        setExpanded(
            navigation
                .filter(
                    (item) =>
                        item.children?.length &&
                        isBranchActive(activePath, item),
                )
                .map((item) => item.route),
        );
    }, [open, activePath, navigation]);

    const toggle = (route: string) =>
        setExpanded((current) =>
            current.includes(route)
                ? current.filter((entry) => entry !== route)
                : [...current, route],
        );

    const itemSx = (active: boolean) => ({
        borderRadius: 1,
        borderLeft: `2px solid ${
            active ? theme.palette.primary.main : "transparent"
        }`,
        backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.08)
            : "transparent",
    });

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: DRAWER_WIDTH,
                },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2, gap: 1 }}
            >
                {brand ??
                    (logoUrl ? (
                        <Box
                            component="img"
                            src={logoUrl}
                            alt={name}
                            sx={{ height: 32, width: "auto" }}
                        />
                    ) : (
                        <Typography variant="subtitle1" noWrap>
                            {name}
                        </Typography>
                    ))}
                <IconButton
                    onClick={onClose}
                    aria-label="Navigation schließen"
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Stack>

            <Divider />

            <List component="nav" sx={{ p: 1.5, flex: 1 }}>
                {navigation.map((item) => {
                    const children = item.children ?? [];
                    const active = isBranchActive(activePath, item);
                    const isOpen = expanded.includes(item.route);

                    return (
                        <React.Fragment key={item.route}>
                            <ListItem
                                disablePadding
                                secondaryAction={
                                    children.length > 0 ? (
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={() => toggle(item.route)}
                                            aria-label={`${item.name} ${
                                                isOpen
                                                    ? "zuklappen"
                                                    : "aufklappen"
                                            }`}
                                            aria-expanded={isOpen}
                                        >
                                            {isOpen ? (
                                                <ExpandLessIcon fontSize="small" />
                                            ) : (
                                                <ExpandMoreIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    ) : undefined
                                }
                            >
                                <ListItemButton
                                    component={Link}
                                    href={item.route}
                                    onClick={onClose}
                                    aria-current={
                                        isActiveRoute(activePath, item.route)
                                            ? "page"
                                            : undefined
                                    }
                                    sx={itemSx(active)}
                                >
                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{
                                            fontWeight: active ? 600 : 500,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>

                            {children.length > 0 && (
                                <Collapse in={isOpen} unmountOnExit>
                                    <List disablePadding sx={{ pl: 2 }}>
                                        {children.map((child) => {
                                            const childActive = isActiveRoute(
                                                activePath,
                                                child.route,
                                            );

                                            return (
                                                <ListItem
                                                    key={child.route}
                                                    disablePadding
                                                >
                                                    <ListItemButton
                                                        component={Link}
                                                        href={child.route}
                                                        onClick={onClose}
                                                        aria-current={
                                                            childActive
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        sx={itemSx(childActive)}
                                                    >
                                                        <ListItemText
                                                            primary={child.name}
                                                            primaryTypographyProps={{
                                                                variant:
                                                                    "body2",
                                                                fontWeight:
                                                                    childActive
                                                                        ? 600
                                                                        : 400,
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    );
                })}
            </List>

            <Divider sx={{ mx: 2 }} />

            <Stack spacing={1} sx={{ p: 2 }}>
                {authArea ?? (
                    <HeaderAuthArea
                        loggedIn={loggedIn}
                        fullWidth
                        onNavigate={onClose}
                    />
                )}
                <HeaderSocial />
            </Stack>
        </Drawer>
    );
};
