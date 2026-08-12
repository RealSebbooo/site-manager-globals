"use client";

import React, { type FC, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import "../../theme/augmentation";

export type MyModalProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    /** Deaktiviert die Höhenbegrenzung, wenn der Inhalt selbst scrollt. */
    disableScroll?: boolean;
};

/** Zentriertes Dialogfenster mit Titelzeile und Schließen-Icon. */
export const MyModal: FC<MyModalProps> = ({
    open,
    title,
    children,
    onClose,
    disableScroll = false,
}) => {
    const theme = useTheme();

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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid gray",
                            pb: 1,
                        }}
                    >
                        <Typography variant="h5">{title}</Typography>
                        <CloseIcon
                            style={{ cursor: "pointer" }}
                            onClick={onClose}
                        />
                    </Box>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
};

export default MyModal;
