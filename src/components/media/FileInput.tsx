"use client";

import React, { type FC, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { getFirebaseStorage } from "../../firebase/getFirebase";
import type { ThumbnailType } from "../../types/file";
import { PlaceholderFile, PreviewFile } from "./styled";

export type FileInputProps = {
    onChange: (fileUrl: string, fileName: string) => void;
    value?: string;
    /** Gesetzt → Bildvorschau statt reinem Upload-Icon. */
    thumbnail?: ThumbnailType;
    /** `accept`-Attribut des Datei-Dialogs */
    accept?: string;
    /** Zielordner im Firebase Storage */
    folder?: string;
    placeholderText?: string;
};

/**
 * Lädt eine Datei in den Firebase Storage und meldet die Download-URL zurück.
 * Braucht eine konfigurierte Firebase-Instanz (siehe `@site/globals/firebase`).
 */
export const FileInput: FC<FileInputProps> = ({
    onChange,
    value,
    thumbnail,
    accept = "*",
    folder = "files",
    placeholderText = "Bild hochladen",
}) => {
    const [localValue, setLocalValue] = useState("");
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileRef = ref(
                getFirebaseStorage(),
                `${folder}/${file.name}${uuid()}`,
            );
            const uploaded = await uploadBytes(fileRef, file);
            const url = await getDownloadURL(uploaded.ref);

            setLocalValue(url);
            onChange(url, file.name);
        } catch (_error) {
            toast.error("Upload fehlgeschlagen");
        } finally {
            setUploading(false);
            // Damit dieselbe Datei erneut gewählt werden kann.
            event.target.value = "";
        }
    };

    const triggerInput = () => inputRef.current?.click();

    const clear = () => {
        setLocalValue("");
        onChange("", "");
    };

    return (
        <>
            <div>
                {!thumbnail ? (
                    <IconButton
                        onClick={triggerInput}
                        size="small"
                        disabled={uploading}
                        aria-label="Datei hochladen"
                    >
                        <UploadFileIcon />
                    </IconButton>
                ) : localValue ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <PreviewFile
                            thumbnail={thumbnail}
                            interactive
                            src={localValue}
                            alt=""
                            onClick={triggerInput}
                        />
                        <IconButton
                            onClick={clear}
                            aria-label="Bild entfernen"
                            color="primary"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ) : (
                    <PlaceholderFile
                        thumbnail={thumbnail}
                        interactive
                        onClick={triggerInput}
                    >
                        {uploading ? "Wird hochgeladen …" : placeholderText}
                    </PlaceholderFile>
                )}
            </div>
            <input
                type="file"
                accept={accept}
                onChange={handleInput}
                ref={inputRef}
                style={{ display: "none" }}
            />
        </>
    );
};
