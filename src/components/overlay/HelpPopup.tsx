"use client";

import React, { type FC, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import "../../theme/augmentation";

export type HelpPopupProps = {
    text: string;
    /**
     * Eigener Auslöser statt des Fragezeichen-Icons. Bekommt die Handler
     * für Hover/Fokus übergeben.
     */
    children?: (props: {
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
        onMouseLeave: () => void;
    }) => React.ReactNode;
};

/** Kleiner Erklärtext, der beim Überfahren des Auslösers erscheint. */
export const HelpPopup: FC<HelpPopupProps> = ({ text, children }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const close = () => setAnchorEl(null);

    const triggerProps = { onMouseEnter: open, onMouseLeave: close };

    return (
        <>
            {children ? (
                children(triggerProps)
            ) : (
                <IconButton size="small" aria-label={text} {...triggerProps}>
                    <HelpOutlineIcon fontSize="small" />
                </IconButton>
            )}
            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="top"
                style={{ zIndex: 10000 }}
            >
                <Box
                    sx={{
                        p: 1,
                        borderRadius: "4px",
                        backgroundColor: theme.palette.surface.main,
                        maxWidth: "250px",
                        boxShadow: 3,
                    }}
                >
                    {text}
                </Box>
            </Popper>
        </>
    );
};
