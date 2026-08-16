"use client";

import React, { type FC } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useSiteConfig } from "../../config/SiteConfigProvider";
import type { SiteSocialLinks } from "../../config/SiteConfig";

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

export type HeaderSocialProps = {
    size?: "small" | "medium";
};

/**
 * Die Social-Icons der Kopfzeile. Gezeigt wird nur, was in der `SiteConfig`
 * unter `social` auch wirklich steht.
 *
 * `email` und `phone` öffnen im selben Tab, alles andere in einem neuen.
 */
export const HeaderSocial: FC<HeaderSocialProps> = ({ size = "small" }) => {
    const { social } = useSiteConfig();
    const links = SOCIAL_ICONS.filter(({ key }) => social?.[key]);

    if (links.length === 0) return null;

    return (
        <Stack direction="row" spacing={0.25}>
            {links.map(({ key, label, icon }) => (
                <IconButton
                    key={key}
                    component="a"
                    href={social?.[key]}
                    target={
                        key === "email" || key === "phone" ? undefined : "_blank"
                    }
                    rel="noreferrer noopener"
                    aria-label={label}
                    size={size}
                    color="inherit"
                >
                    {icon}
                </IconButton>
            ))}
        </Stack>
    );
};
