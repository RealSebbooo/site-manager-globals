"use client";

import React, { type FC, useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import type { SiteSocialLinks } from "../../config/SiteConfig";

const DRAWER_WIDTH = 260;

const SOCIAL_ICONS: Array<{
    key: keyof SiteSocialLinks;
    label: string;
    icon: React.ReactNode;
}> = [
    { key: "instagram", label: "Instagram", icon: <InstagramIcon /> },
    { key: "facebook", label: "Facebook", icon: <FacebookIcon /> },
    { key: "youtube", label: "YouTube", icon: <YouTubeIcon /> },
    { key: "tiktok", label: "TikTok", icon: <MusicNoteIcon /> },
    { key: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon /> },
    { key: "email", label: "E-Mail", icon: <EmailIcon /> },
    { key: "phone", label: "Telefon", icon: <PhoneIcon /> },
];

export type HeaderProps = {
    /** Farbe der Navigationslinks in der Desktop-Leiste */
    linkColor?: string;
};

/**
 * Kopfzeile mit Navigation, Social-Icons und mobilem Drawer.
 * Alle Inhalte kommen aus der `SiteConfig`, hier steht nichts Projektspezifisches.
 */
export const Header: FC<HeaderProps> = ({ linkColor = "#fff" }) => {
    const { name, logoUrl, navigation, social } = useSiteConfig();
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeDrawer = () => setMobileOpen(false);

    const socialLinks = SOCIAL_ICONS.filter(({ key }) => social?.[key]);

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <IconButton
                        edge="start"
                        onClick={() => setMobileOpen((open) => !open)}
                        sx={{ mr: 2, display: { sm: "none" } }}
                        aria-label="Navigation öffnen"
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {navigation.map((item, index) => (
                            <React.Fragment key={item.route}>
                                <Button
                                    sx={{ color: linkColor }}
                                    component={Link}
                                    href={item.route}
                                >
                                    {item.name}
                                </Button>
                                {index !== navigation.length - 1 && (
                                    <span>|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Box>
                        {socialLinks.map(({ key, label, icon }) => (
                            <IconButton
                                key={key}
                                component="a"
                                href={social?.[key]}
                                target={
                                    key === "email" || key === "phone"
                                        ? undefined
                                        : "_blank"
                                }
                                rel="noreferrer noopener"
                                aria-label={label}
                            >
                                {icon}
                            </IconButton>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <nav>
                <Drawer
                    open={mobileOpen}
                    onClose={closeDrawer}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_WIDTH,
                        },
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        {logoUrl ? (
                            <img
                                style={{ margin: "1rem" }}
                                width="150px"
                                src={logoUrl}
                                alt={`${name} Logo`}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ p: 2 }}>
                                {name}
                            </Typography>
                        )}
                        <Divider />
                        <List>
                            {navigation.map((item) => (
                                <ListItem key={item.route} disablePadding>
                                    <ListItemButton
                                        sx={{ textAlign: "center" }}
                                        component={Link}
                                        href={item.route}
                                        onClick={closeDrawer}
                                    >
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </nav>
        </Box>
    );
};
