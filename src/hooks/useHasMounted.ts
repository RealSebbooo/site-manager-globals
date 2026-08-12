"use client";

import { useEffect, useState } from "react";

/**
 * `false` beim Server-Render und beim ersten Client-Render, danach `true`.
 * Nützlich, um Browser-only-Inhalte ohne Hydration-Mismatch zu rendern.
 */
export const useHasMounted = (): boolean => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
};
