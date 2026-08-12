"use client";

import React, { type FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import type { ContributionType } from "../../types/contribution";
import { getImageMeta } from "../../utils/getImageMeta";
import {
    setItemToDatabase,
    updateItemFromDatabase,
} from "../../database/items";
import { FileInput } from "../media/FileInput";
import { PreviewBoxes } from "./PreviewBoxes";

const HORIZONTAL_POSITIONS = [
    { value: "above", label: "Oben" },
    { value: "below", label: "Unten" },
    { value: "right", label: "Rechts" },
    { value: "left", label: "Links" },
];

const VERTICAL_POSITIONS = [
    { value: "right", label: "Rechts" },
    { value: "left", label: "Links" },
];

const SIZES = [20, 30, 50, 75, 100];

export type ContributionEditorProps = {
    /** Gesetzt → Bearbeiten statt Anlegen */
    contribution?: ContributionType;
    /** Firestore-Collection, in die geschrieben wird */
    collectionName?: string;
    /** Ohne Callback wird die Seite nach dem Speichern neu geladen. */
    onSaved?: () => void;
};

/** Formular zum Anlegen und Bearbeiten eines Beitrags, mit Layout-Vorschau. */
export const ContributionEditor: FC<ContributionEditorProps> = ({
    contribution,
    collectionName = "Contributions",
    onSaved,
}) => {
    const [image, setImage] = useState("");
    const [orientation, setOrientation] = useState("horizontal");
    const [position, setPosition] = useState("above");
    const [size, setSize] = useState(50);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!contribution) return;
        setImage(contribution.image.src);
        setTitle(contribution.title);
        setDescription(contribution.description);
        setOrientation(contribution.image.orientation);
        setPosition(contribution.image.position);
        setSize(contribution.image.size);
    }, [contribution]);

    // Bei einem neu hochgeladenen Bild die Ausrichtung vorschlagen.
    const applyImage = (url: string) => {
        setImage(url);
        if (!url) return;

        void getImageMeta(url).then((meta) => {
            if (!meta) return;
            setOrientation(
                meta.naturalHeight > meta.naturalWidth
                    ? "vertical"
                    : "horizontal",
            );
            setPosition("right");
        });
    };

    const save = async () => {
        if (!title.trim()) return toast.error("Titel fehlt");
        if (!description.trim()) return toast.error("Beitragstext fehlt");

        setSaving(true);
        try {
            const payload = {
                title,
                description,
                image: { src: image, position, size, orientation },
            };

            if (contribution) {
                await updateItemFromDatabase(collectionName, {
                    ...payload,
                    uid: contribution.uid,
                    created: contribution.created,
                });
            } else {
                await setItemToDatabase(collectionName, {
                    ...payload,
                    created: new Date().toISOString(),
                    uid: "",
                });
            }

            toast.success("Beitrag gespeichert");

            if (onSaved) onSaved();
            else window.location.reload();
        } catch (_error) {
            toast.error("Speichern fehlgeschlagen");
        } finally {
            setSaving(false);
        }
    };

    const positions =
        orientation === "horizontal" ? HORIZONTAL_POSITIONS : VERTICAL_POSITIONS;
    const showSize = position === "right" || position === "left";

    return (
        <Card sx={{ padding: "1rem", height: "fit-content" }}>
            <Typography variant="h5">
                {contribution ? "Beitrag bearbeiten" : "Neuer Beitrag"}
            </Typography>
            <br />
            <Grid container sx={{ height: "fit-content" }}>
                <Grid item xs={12} md={3} marginBottom={2}>
                    <InputLabel>Bildeinstellungen</InputLabel>
                    <FileInput
                        value={image}
                        onChange={applyImage}
                        accept="image/*"
                        thumbnail={{ width: 150, height: 150 }}
                    />
                </Grid>

                {image && (
                    <>
                        <Grid item xs={12} md={2}>
                            <InputLabel>Ausrichtung</InputLabel>
                            <RadioGroup
                                value={orientation}
                                onChange={(event) => {
                                    setOrientation(event.target.value);
                                    setPosition(
                                        event.target.value === "horizontal"
                                            ? "above"
                                            : "right",
                                    );
                                }}
                            >
                                <FormControlLabel
                                    value="horizontal"
                                    control={<Radio />}
                                    label="Horizontal"
                                />
                                <FormControlLabel
                                    value="vertical"
                                    control={<Radio />}
                                    label="Vertikal"
                                />
                            </RadioGroup>

                            <InputLabel>Position</InputLabel>
                            <RadioGroup
                                value={position}
                                onChange={(event) =>
                                    setPosition(event.target.value)
                                }
                            >
                                {positions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.label}
                                    />
                                ))}
                            </RadioGroup>

                            {showSize && (
                                <>
                                    <InputLabel>Größe</InputLabel>
                                    <RadioGroup
                                        value={String(size)}
                                        onChange={(event) =>
                                            setSize(Number(event.target.value))
                                        }
                                    >
                                        {SIZES.map((option) => (
                                            <FormControlLabel
                                                key={option}
                                                value={String(option)}
                                                control={<Radio />}
                                                label={`${option}%`}
                                            />
                                        ))}
                                    </RadioGroup>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <InputLabel>Vorschau</InputLabel>
                            <PreviewBoxes
                                size={size}
                                orientation={orientation}
                                position={position}
                                image={image}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            <TextField
                fullWidth
                sx={{ marginBottom: "1rem" }}
                size="small"
                label="Titel*"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            <TextareaAutosize
                placeholder="Beitrag*"
                minRows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <Button
                variant="contained"
                onClick={() => void save()}
                disabled={saving || !title.trim() || !description.trim()}
            >
                {contribution ? "Speichern" : "Veröffentlichen"}
            </Button>
        </Card>
    );
};
