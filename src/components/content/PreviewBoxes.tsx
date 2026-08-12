"use client";

import React, { type FC } from "react";
import { styled } from "@mui/material/styles";

type BoxProps = {
    widthPercent: number;
    heightPercent: number;
    image?: string;
};

const boxBase = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    fontSize: 30,
} as const;

const sizeOf = ({ widthPercent, heightPercent }: BoxProps) => ({
    minWidth: `${widthPercent}%`,
    maxWidth: `${widthPercent}%`,
    minHeight: `${heightPercent}%`,
    maxHeight: `${heightPercent}%`,
});

const boxProps = (prop: string) =>
    prop !== "widthPercent" && prop !== "heightPercent" && prop !== "image";

const TextBox = styled("div", { shouldForwardProp: boxProps })<BoxProps>(
    (props) => ({
        ...boxBase,
        ...sizeOf(props),
        backgroundColor: "lightgray",
    }),
);

const ImageBox = styled("div", { shouldForwardProp: boxProps })<BoxProps>(
    (props) => ({
        ...boxBase,
        ...sizeOf(props),
        backgroundColor: "red",
        ...(props.image
            ? {
                  background: `url("${props.image}")`,
                  backgroundSize: "cover",
              }
            : {}),
    }),
);

const WrapperBox = styled("div")({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    justifyContent: "start",
    width: "100%",
    height: "100%",
    maxHeight: 400,
    aspectRatio: "1",
});

export type PreviewBoxesProps = {
    /** Bildbreite in Prozent */
    size: number;
    orientation: string;
    position: string;
    image?: string;
};

/**
 * Schematische Vorschau, wie Bild und Text im Beitrag angeordnet werden.
 * Rein visuell — keine echten Inhalte.
 */
export const PreviewBoxes: FC<PreviewBoxesProps> = ({
    size,
    orientation,
    position,
    image,
}) => {
    const isHorizontal = orientation === "horizontal";
    const ratio = isHorizontal ? 9 / 16 : 16 / 9;

    const imageHeight = size * ratio;
    const fullHeight = 100 * ratio;

    const imageBox = (widthPercent: number, heightPercent: number) => (
        <ImageBox
            widthPercent={widthPercent}
            heightPercent={heightPercent}
            image={image}
        >
            {!image && "Bild"}
        </ImageBox>
    );

    if (position === "left" || position === "right") {
        const spacer = (
            <TextBox widthPercent={100 - size} heightPercent={imageHeight} />
        );

        return (
            <WrapperBox>
                {position === "left" ? imageBox(size, imageHeight) : spacer}
                {position === "left" ? spacer : imageBox(size, imageHeight)}
                <TextBox widthPercent={100} heightPercent={100 - imageHeight}>
                    Text
                </TextBox>
            </WrapperBox>
        );
    }

    if (!isHorizontal) return null;

    const textBlock = (
        <TextBox widthPercent={100} heightPercent={100 - fullHeight}>
            Text
        </TextBox>
    );

    return (
        <WrapperBox>
            {position === "below" && textBlock}
            {imageBox(100, fullHeight)}
            {position !== "below" && textBlock}
        </WrapperBox>
    );
};
