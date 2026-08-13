"use client";

import Head from "next/head";
import React, { type FC } from "react";
import { useSiteConfig } from "../../config/SiteConfigProvider";

export type PageHeadProps = {
    /** Ohne Titel steht nur der Seitenname im Tab. */
    title?: string;
    description?: string;
    noIndex?: boolean;
};

/**
 * `<title>` und Meta-Tags einer Seite, für den **Pages Router**.
 * Im App Router stattdessen `buildMetadata()` in `generateMetadata` nutzen.
 */
export const PageHead: FC<PageHeadProps> = ({
    title,
    description,
    noIndex = false,
}) => {
    const config = useSiteConfig();

    return (
        <Head>
            <title>{title ? `${title} | ${config.name}` : config.name}</title>
            <meta
                name="description"
                content={description ?? config.description}
            />
            {noIndex && <meta name="robots" content="noindex,nofollow" />}
        </Head>
    );
};
