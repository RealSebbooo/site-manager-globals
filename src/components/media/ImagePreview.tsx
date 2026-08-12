"use client";

import React, { type FC, useState } from "react";
import { PlaceholderFile, PreviewFile } from "./styled";
import { MyModal } from "../overlay/Modal";

export type ImagePreviewProps = {
    /** Bild-URL. Leer → Platzhalter mit dem Anfangsbuchstaben von `alt`. */
    value: string;
    alt: string;
    width?: number;
    height?: number;
};

/** Thumbnail, das per Klick eine größere Ansicht im Modal öffnet. */
export const ImagePreview: FC<ImagePreviewProps> = ({
    value,
    alt,
    width = 100,
    height = 100,
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    if (!value) {
        return (
            <PlaceholderFile thumbnail={{ width, height }}>
                {alt[0]?.toUpperCase()}
            </PlaceholderFile>
        );
    }

    return (
        <>
            <PreviewFile
                thumbnail={{ width, height }}
                interactive
                src={value}
                alt={alt}
                onClick={() => setPreviewOpen(true)}
            />
            <MyModal
                title={alt}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
            >
                <PreviewFile
                    style={{ marginTop: "1rem" }}
                    thumbnail={{ width: 300, height: 300 }}
                    src={value}
                    alt={alt}
                />
            </MyModal>
        </>
    );
};
