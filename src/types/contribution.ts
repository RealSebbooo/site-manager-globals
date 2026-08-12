export type ContributionImagePosition = "above" | "below" | "left" | "right";
export type ContributionImageOrientation = "horizontal" | "vertical";

export type ContributionImageType = {
    src: string;
    position: string;
    orientation: string;
    /** Breite des Bildes in Prozent der Textspalte */
    size: number;
};

export type ContributionType = {
    title: string;
    description: string;
    image: ContributionImageType;
    /** ISO-String */
    created: string;
    uid: string;
};
