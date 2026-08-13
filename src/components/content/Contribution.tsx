"use client";

import React, { type FC, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import type { ContributionType } from "../../types/contribution";
import { getImageMeta } from "../../utils/getImageMeta";
import { useHasMounted } from "../../hooks/useHasMounted";
import { isLoggedIn } from "../../auth/isLoggedIn";
import { MyModal } from "../overlay/Modal";
import { ContributionEditor } from "./ContributionEditor";

type FloatBoxProps = {
    boxHeight: number;
    boxWidth: number;
    size: number;
    image: string;
    position: string;
};

const floatBoxProps = (prop: string) =>
    !["boxHeight", "boxWidth", "size", "image", "position"].includes(prop);

/** Bildfläche, um die der Beitragstext herumfließt. */
const FloatBox = styled("div", { shouldForwardProp: floatBoxProps })<FloatBoxProps>(
    ({ boxHeight, boxWidth, size, image, position }) => ({
        float: position as "left" | "right" | "none",
        background: `url("${image}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        height: boxHeight,
        width: boxWidth,
        cursor: "pointer",
        ...(position === "below"
            ? { marginTop: "0.5rem" }
            : {
                  marginBottom: "0.5rem",
                  ...(size !== 100 && position === "right"
                      ? { marginLeft: "0.5rem" }
                      : {}),
                  ...(size !== 100 && position === "left"
                      ? { marginRight: "0.5rem" }
                      : {}),
              }),
    }),
);

/**
 * Bewusst ein `div` und kein `p`: der Float-Container darunter ist ein
 * Block-Element und wäre in einem `<p>` ungültiges HTML (Hydration-Fehler).
 * Die Abstände entsprechen dem Browser-Default eines Absatzes.
 */
const DescriptionText = styled("div")({
    fontSize: 16,
    lineHeight: "1.25rem",
    whiteSpace: "pre-line",
    margin: "1em 0",
});

export type ContributionProps = {
    contribution: ContributionType;
    /**
     * Zeigt den Bearbeiten-Stift. Ohne Angabe: sichtbar, sobald ein Login
     * im Browser hinterlegt ist.
     */
    editable?: boolean;
    /** Firestore-Collection, in die der Editor schreibt */
    collectionName?: string;
};

/**
 * Ein Beitrag (News, Bericht, Ankündigung) mit Bild, um das der Text fließt.
 * Das Bild wird auf die Textspalte eingepasst. Größe, Ausrichtung und
 * Position stecken im Beitrag selbst.
 */
export const Contribution: FC<ContributionProps> = ({
    contribution,
    editable,
    collectionName,
}) => {
    const hasMounted = useHasMounted();
    const [edit, setEdit] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [natural, setNatural] = useState({ width: 0, height: 0 });
    const [boxSize, setBoxSize] = useState({ height: 0, width: 0 });

    const descriptionRef = useRef<HTMLDivElement>(null);

    const { src, size } = contribution.image;

    useEffect(() => {
        let active = true;

        void getImageMeta(src).then((meta) => {
            if (!active) return;
            setNatural({
                width: meta?.naturalWidth ?? 0,
                height: meta?.naturalHeight ?? 0,
            });
        });

        return () => {
            active = false;
        };
    }, [src]);

    // Läuft bewusst nur bei neuen Bildmaßen, nicht bei jeder Größenänderung
    // der Box, sonst schaukeln sich Float-Höhe und Texthöhe gegenseitig hoch.
    useEffect(() => {
        if (!natural.width || !natural.height) return;

        const element = descriptionRef.current;
        const availableHeight = element?.clientHeight || 9999;
        const availableWidth = element?.clientWidth || 9999;

        const targetWidth = availableWidth * (size / 100);
        const scaledWidth = natural.width * (availableHeight / natural.height);

        const fitsInHeight =
            natural.height <= availableHeight || scaledWidth > targetWidth;

        setBoxSize(
            fitsInHeight
                ? {
                      width: targetWidth,
                      height: natural.height / (natural.width / targetWidth),
                  }
                : { width: scaledWidth, height: availableHeight },
        );
    }, [natural, size]);

    const showEditButton = editable ?? (hasMounted && isLoggedIn());

    if (edit) {
        return (
            <div style={{ marginBottom: "2rem" }}>
                <ContributionEditor
                    contribution={contribution}
                    collectionName={collectionName}
                />
            </div>
        );
    }

    return (
        <div style={{ marginBottom: "2rem" }}>
            <MyModal
                title={contribution.title}
                open={imageModal}
                onClose={() => setImageModal(false)}
            >
                <img
                    src={src}
                    alt={contribution.title}
                    style={{
                        maxHeight: "calc(100vh - 12rem)",
                        maxWidth: "inherit",
                    }}
                />
            </MyModal>

            <Typography variant="h4">
                {contribution.title}
                {showEditButton && (
                    <IconButton
                        onClick={() => setEdit(true)}
                        aria-label="Beitrag bearbeiten"
                    >
                        <EditIcon />
                    </IconButton>
                )}
                <InputLabel>
                    {new Date(contribution.created).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                </InputLabel>
            </Typography>

            <DescriptionText ref={descriptionRef}>
                {contribution.image.position === "below" && (
                    <>{contribution.description}</>
                )}
                {src && (
                    <FloatBox
                        boxHeight={boxSize.height}
                        boxWidth={boxSize.width}
                        size={size}
                        image={src}
                        position={contribution.image.position}
                        onClick={() => setImageModal(true)}
                    />
                )}
                {contribution.image.position !== "below" && (
                    <>{contribution.description}</>
                )}
            </DescriptionText>
        </div>
    );
};
