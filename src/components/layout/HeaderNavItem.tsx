"use client";

import React, { type FC, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, useTheme } from "@mui/material/styles";
import type { SiteNavigationItem } from "../../config/SiteConfig";
import { isActiveRoute, isBranchActive } from "./navigationUtils";

/** Wie lange der Zeiger den Rand verlassen darf, bevor zugeklappt wird. */
const HOVER_DELAY_MS = 120;

export type HeaderNavItemProps = {
    item: SiteNavigationItem;
    activePath: string;
};

/**
 * Ein Eintrag der Desktop-Navigation.
 *
 * Ohne Kinder ist das ein Link, mit Kindern ein Auslöser für ein Dropdown.
 * Bewusst `Popper` statt `Menu`: `Menu` legt einen Backdrop über die Seite
 * und sperrt das Scrollen, für eine Menüleiste ist das falsch.
 */
export const HeaderNavItem: FC<HeaderNavItemProps> = ({ item, activePath }) => {
    const theme = useTheme();
    const menuId = useId();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout>>();
    const [open, setOpen] = useState(false);

    const children = item.children ?? [];
    const hasChildren = children.length > 0;
    const active = isBranchActive(activePath, item);

    // Bei jedem Routenwechsel zu, sonst bleibt das Menü nach dem Klick offen.
    useEffect(() => {
        setOpen(false);
    }, [activePath]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const openNow = () => {
        clearTimeout(closeTimer.current);
        setOpen(true);
    };

    const closeSoon = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), HOVER_DELAY_MS);
    };

    /** Nach dem Schließen gehört der Fokus zurück auf den Auslöser. */
    const closeAndFocus = () => {
        setOpen(false);
        anchorRef.current?.focus();
    };

    const buttonSx = {
        color: "inherit",
        px: 1.25,
        fontWeight: active ? 600 : 500,
        opacity: active ? 1 : 0.82,
        "&:hover": { backgroundColor: "transparent", opacity: 1 },
        "&::after": {
            content: '""',
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 4,
            height: 2,
            borderRadius: 2,
            backgroundColor: "currentColor",
            opacity: active ? 1 : 0,
            transition: `opacity ${theme.transitions.duration.shorter}ms`,
        },
        "&:hover::after": { opacity: active ? 1 : 0.4 },
    } as const;

    if (!hasChildren) {
        return (
            <Button
                component={Link}
                href={item.route}
                disableRipple
                aria-current={active ? "page" : undefined}
                sx={{ position: "relative", ...buttonSx }}
            >
                {item.name}
            </Button>
        );
    }

    return (
        <Box
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            sx={{ position: "relative" }}
        >
            <Button
                ref={anchorRef}
                disableRipple
                id={`${menuId}-button`}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                aria-current={active ? "page" : undefined}
                endIcon={
                    <ExpandMoreIcon
                        fontSize="small"
                        sx={{
                            transform: open ? "rotate(180deg)" : "none",
                            transition: `transform ${theme.transitions.duration.shorter}ms`,
                        }}
                    />
                }
                onClick={() => (open ? setOpen(false) : openNow())}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        openNow();
                    }
                    if (event.key === "Escape") setOpen(false);
                }}
                sx={{ position: "relative", ...buttonSx }}
            >
                {item.name}
            </Button>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: theme.zIndex.appBar + 1, pt: 1 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
                        <Paper
                            elevation={8}
                            sx={{
                                minWidth: 240,
                                overflow: "hidden",
                                border: `1px solid ${alpha(
                                    theme.palette.text.primary,
                                    0.1,
                                )}`,
                            }}
                        >
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <MenuList
                                    id={menuId}
                                    autoFocusItem={open}
                                    aria-labelledby={`${menuId}-button`}
                                    onKeyDown={(event) => {
                                        if (event.key === "Escape") {
                                            event.preventDefault();
                                            closeAndFocus();
                                        }
                                        if (event.key === "Tab") setOpen(false);
                                    }}
                                >
                                    {children.map((child) => {
                                        const childActive = isActiveRoute(
                                            activePath,
                                            child.route,
                                        );

                                        return (
                                            <MenuItem
                                                key={child.route}
                                                component={Link}
                                                href={child.route}
                                                selected={childActive}
                                                aria-current={
                                                    childActive
                                                        ? "page"
                                                        : undefined
                                                }
                                                onClick={() => setOpen(false)}
                                                sx={{ py: 1 }}
                                            >
                                                <ListItemText
                                                    primary={child.name}
                                                    secondary={child.description}
                                                    primaryTypographyProps={{
                                                        fontWeight: childActive
                                                            ? 600
                                                            : 500,
                                                    }}
                                                    secondaryTypographyProps={{
                                                        variant: "caption",
                                                    }}
                                                />
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
};
