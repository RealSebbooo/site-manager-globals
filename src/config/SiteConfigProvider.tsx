"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { FALLBACK_SITE_CONFIG, type SiteConfig } from "./SiteConfig";

const SiteConfigContext = createContext<SiteConfig>(FALLBACK_SITE_CONFIG);

type SiteConfigProviderProps = {
    config: SiteConfig;
    children: ReactNode;
};

export const SiteConfigProvider = ({
    config,
    children,
}: SiteConfigProviderProps) => (
    <SiteConfigContext.Provider value={config}>
        {children}
    </SiteConfigContext.Provider>
);

export const useSiteConfig = (): SiteConfig => useContext(SiteConfigContext);
