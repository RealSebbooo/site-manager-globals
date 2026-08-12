"use client";

import { styled } from "@mui/material/styles";
import "../../theme/augmentation";
import type { ThumbnailType } from "../../types/file";

type ThumbnailProps = {
    thumbnail: ThumbnailType;
    /** Zeigt Zeiger-Cursor und Hover-Abdunklung, wenn die Fläche klickbar ist. */
    interactive?: boolean;
};

const interactiveStyles = {
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": { filter: "brightness(75%)" },
} as const;

const withoutThumbnailProps = (prop: string) =>
    prop !== "thumbnail" && prop !== "interactive";

/** Bild, auf Thumbnail-Maße begrenzt. */
export const PreviewFile = styled("img", {
    shouldForwardProp: withoutThumbnailProps,
})<ThumbnailProps>(({ theme, thumbnail, interactive }) => ({
    objectFit: "cover",
    maxHeight: thumbnail.height,
    maxWidth: thumbnail.width,
    border: `1px solid ${theme.palette.surface.main}`,
    ...(interactive ? interactiveStyles : {}),
}));

/** Platzhalterfläche in Thumbnail-Größe, wenn (noch) kein Bild da ist. */
export const PlaceholderFile = styled("div", {
    shouldForwardProp: withoutThumbnailProps,
})<ThumbnailProps>(({ theme, thumbnail, interactive }) => ({
    backgroundColor: theme.palette.surface.main,
    minHeight: thumbnail.height,
    maxHeight: thumbnail.height,
    minWidth: thumbnail.width,
    maxWidth: thumbnail.width,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    ...(interactive ? interactiveStyles : {}),
}));

export const FileContainer = styled("div")({
    position: "relative",
});

export const FileText = styled("div")({
    position: "absolute",
    top: 45,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "0 auto",
});
