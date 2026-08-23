"use client";

import React, { type FC, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../../theme/augmentation";

export type MyModalProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    /** Deaktiviert die Höhenbegrenzung, wenn der Inhalt selbst scrollt. */
    disableScroll?: boolean;
};

/**
 * Dialog mit Titelzeile und Schließen-Icon.
 *
 * Auf dem Desktop ein zentriertes Fenster, auf dem Handy ein Bottom Sheet: es
 * fährt von unten herein, füllt die Breite und lässt sich am Griff oben nach
 * unten wegziehen. Das Schließen-Icon bleibt in beiden Fassungen, der Griff
 * kommt auf dem Handy als zweiter, vertrauter Weg dazu.
 */
export const MyModal: FC<MyModalProps> = ({
    open,
    title,
    children,
    onClose,
    disableScroll = false,
}) => {
    const theme = useTheme();
    const mobil = useMediaQuery(theme.breakpoints.down("sm"));

    const kopf = (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid gray",
                pb: 1,
            }}
        >
            <Typography variant="h5">{title}</Typography>
            <CloseIcon
                aria-label="Schließen"
                style={{ cursor: "pointer" }}
                onClick={onClose}
            />
        </Box>
    );

    // Bottom Sheet: von unten, am Griff nach unten wegziehbar. Der Titel und
    // der Griff bleiben stehen, nur der Inhalt darunter scrollt.
    if (mobil) {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={() => {}}
                disableSwipeToOpen
                // Geschlossen nichts im DOM lassen, wie beim zentrierten
                // Modal: sonst hinge an jeder Position ein unsichtbares Sheet.
                ModalProps={{ keepMounted: false }}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        maxHeight: "90vh",
                        bgcolor: theme.palette.surface.main,
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                {/* Der Griff: die vertraute kurze Leiste, an der man das Sheet
                    nach unten zieht. */}
                <Box
                    aria-hidden
                    sx={{
                        flexShrink: 0,
                        width: 40,
                        height: 5,
                        borderRadius: 3,
                        mx: "auto",
                        mt: 1.5,
                        mb: 1,
                        bgcolor: alpha(theme.palette.text.primary, 0.2),
                    }}
                />
                <Box sx={{ flexShrink: 0, px: 3 }}>{kopf}</Box>
                <Box
                    sx={{
                        px: 3,
                        pb: 3,
                        overflowY: disableScroll ? "visible" : "auto",
                    }}
                >
                    {children}
                </Box>
            </SwipeableDrawer>
        );
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "calc(100vw - 5rem)",
                        minWidth: 300,
                        maxHeight: "calc(100vh - 10rem)",
                        overflowY: disableScroll ? "visible" : "auto",
                        bgcolor: theme.palette.surface.main,
                        p: 4,
                        border: "none",
                        borderRadius: "8px",
                        outline: "none",
                    }}
                >
                    {kopf}
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
};

export default MyModal;
