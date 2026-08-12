import type { Metadata } from "next";
import type { SiteConfig } from "../../config/SiteConfig";

export type BuildMetadataOptions = {
    title?: string;
    description?: string;
    noIndex?: boolean;
};

/**
 * Gegenstück zu `<PageHead />` für den App Router:
 *
 * ```ts
 * export const metadata = buildMetadata(siteConfig, { title: "Termine" });
 * ```
 */
export const buildMetadata = (
    config: SiteConfig,
    { title, description, noIndex }: BuildMetadataOptions = {},
): Metadata => ({
    title: title ? `${title} | ${config.name}` : config.name,
    description: description ?? config.description,
    ...(config.faviconUrl ? { icons: { icon: config.faviconUrl } } : {}),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
});
