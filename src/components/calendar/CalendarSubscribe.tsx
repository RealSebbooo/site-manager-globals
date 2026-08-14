"use client";

import React, { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import DoneIcon from "@mui/icons-material/DoneOutlined";
import { MyModal } from "../overlay/Modal";

export type CalendarSubscribeProps = {
    /** Absolute https-Adresse des Feeds. */
    icsUrl: string;
    /** Beschriftung des Knopfs. */
    label?: string;
    /** Titel des Fensters. */
    title?: string;
    variant?: "outlined" | "text" | "contained";
    size?: "small" | "medium" | "large";
};

/**
 * Knopf, der den Abo-Dialog für einen Kalender-Feed öffnet: einmal eintragen,
 * danach hält der Kalender sich selbst aktuell.
 *
 * Es braucht beide Wege. Apple und Outlook nehmen `webcal://` direkt an,
 * Google Kalender kennt das Schema nicht und will die https-Adresse.
 */
export const CalendarSubscribe: FC<CalendarSubscribeProps> = ({
    icsUrl,
    label = "Kalender abonnieren",
    title = "Kalender abonnieren",
    variant = "outlined",
    size = "small",
}) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const webcalUrl = icsUrl.replace(/^https?:\/\//, "webcal://");

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(icsUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (_clipboardError) {
            // Ohne Clipboard-Rechte bleibt das Feld zum Markieren von Hand.
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                startIcon={<CalendarMonthIcon />}
                onClick={() => setOpen(true)}
            >
                {label}
            </Button>

            <MyModal open={open} title={title} onClose={() => setOpen(false)}>
                <Stack spacing={2.5} sx={{ mt: 2, maxWidth: 460 }}>
                    <Typography variant="body2" color="text.secondary">
                        Einmal eintragen, danach erscheinen neue Termine von
                        selbst im Kalender.
                    </Typography>

                    <Button
                        variant="contained"
                        href={webcalUrl}
                        startIcon={<CalendarMonthIcon />}
                    >
                        In Kalender öffnen
                    </Button>

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Oder die Adresse kopieren
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={icsUrl}
                            onFocus={(event) => event.target.select()}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={copy}
                                            aria-label="Adresse kopieren"
                                        >
                                            {copied ? (
                                                <DoneIcon fontSize="small" />
                                            ) : (
                                                <ContentCopyIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                        Google Kalender: Weitere Kalender, Per URL.
                        <br />
                        Outlook: Kalender hinzufügen, Aus dem Internet
                        abonnieren.
                        <br />
                        Apple: Ablage, Neues Kalenderabonnement.
                        <br />
                        <br />
                        Kalender-Apps laden abonnierte Termine nur alle paar
                        Stunden neu, kurzfristige Änderungen kommen also mit
                        etwas Verzögerung an.
                    </Typography>
                </Stack>
            </MyModal>
        </>
    );
};

export default CalendarSubscribe;
